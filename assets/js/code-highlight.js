// Simple Code Syntax Highlighting
class CodeHighlight {
    constructor() {
        this.init();
    }

    init() {
        const codeBlocks = document.querySelectorAll('pre code, .code-block');
        codeBlocks.forEach(block => {
            this.highlight(block);
        });
    }

    highlight(block) {
        const lang = block.className.match(/language-(\w+)/);
        const code = block.textContent;

        if (lang && lang[1]) {
            block.innerHTML = this.highlightSyntax(code, lang[1]);
        } else {
            // Try to detect language from content
            const detectedLang = this.detectLanguage(code);
            if (detectedLang) {
                block.innerHTML = this.highlightSyntax(code, detectedLang);
            }
        }
    }

    detectLanguage(code) {
        if (code.includes('function') && code.includes('=>')) return 'javascript';
        if (code.includes('<?php') || code.includes('->')) return 'php';
        if (code.includes('import') && code.includes('from')) return 'javascript';
        if (code.includes('#[Route') || code.includes('use Symfony')) return 'php';
        return null;
    }

    highlightSyntax(code, lang) {
        let highlighted = code;

        // Keywords
        const keywords = {
            javascript: ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await'],
            php: ['function', 'class', 'public', 'private', 'protected', 'return', 'if', 'else', 'foreach', 'use', 'namespace', 'extends', 'implements'],
            python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'for', 'while', 'async', 'await', 'True', 'False', 'None']
        };

        if (keywords[lang]) {
            keywords[lang].forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                highlighted = highlighted.replace(regex, `<span class="code-keyword">${keyword}</span>`);
            });
        }

        // Strings
        highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="code-string">"$1"</span>');
        highlighted = highlighted.replace(/'([^']*)'/g, '<span class="code-string">\'$1\'</span>');

        // Numbers
        highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');

        // Comments
        if (lang === 'javascript' || lang === 'php') {
            highlighted = highlighted.replace(/\/\/(.*)$/gm, '<span class="code-comment">//$1</span>');
            highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span class="code-comment">/*$1*/</span>');
        }
        if (lang === 'php') {
            // PHP Variables (starting with $)
            highlighted = highlighted.replace(/(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g, '<span class="code-variable">$1</span>');
            highlighted = highlighted.replace(/#(.*)$/gm, '<span class="code-comment">#$1</span>');
        }

        // Functions
        highlighted = highlighted.replace(/(\w+)\s*\(/g, '<span class="code-function">$1</span>(');

        // Classes
        highlighted = highlighted.replace(/(class|interface)\s+(\w+)/g, '$1 <span class="code-class">$2</span>');

        return highlighted;
    }
}

// Add line numbers to code blocks - Nouvelle structure avec fond blanc/gris
function addLineNumbers() {
    const codeWrappers = document.querySelectorAll('.code-block');

    codeWrappers.forEach(wrapper => {
        // Skip if already processed
        if (wrapper.querySelector('.code-block-line-numbers')) {
            return;
        }

        const preElement = wrapper.querySelector('pre');
        const codeBlock = wrapper.querySelector('code');
        if (!codeBlock || !preElement) return;

        // Get the text content to count lines. Use data-original if available (typing effect)
        const text = codeBlock.getAttribute('data-original') || codeBlock.textContent || codeBlock.innerText;

        // Count newlines
        const match = text.match(/\n/g);
        const linesCount = match ? match.length + 1 : 1;

        // Créer la nouvelle structure
        // 1. Conteneur pour les numéros de ligne (fond blanc)
        const lineNumbersContainer = document.createElement('div');
        lineNumbersContainer.className = 'code-block-line-numbers';
        
        // 2. Générer les numéros de ligne
        const rowsEl = document.createElement('span');
        rowsEl.className = 'line-numbers-rows';
        let rows = '';
        for (let i = 1; i <= linesCount; i++) {
            rows += '<span></span>';
        }
        rowsEl.innerHTML = rows;
        lineNumbersContainer.appendChild(rowsEl);

        // 3. Conteneur pour le code (fond gris)
        const codeContentContainer = document.createElement('div');
        codeContentContainer.className = 'code-block-content';
        codeContentContainer.appendChild(preElement);

        // 4. Réorganiser la structure
        wrapper.innerHTML = '';
        wrapper.appendChild(lineNumbersContainer);
        wrapper.appendChild(codeContentContainer);
        
        wrapper.classList.add('line-numbers');
    });
}

// Initialize Code Highlighting
document.addEventListener('DOMContentLoaded', () => {
    // Wait longer to let typing-effect.js save the original code first
    // et pour permettre à addLineNumbers de s'exécuter après la sauvegarde
    setTimeout(() => {
        if (typeof hljs !== 'undefined') {
            // Highlight all code blocks
            const allCodeBlocks = document.querySelectorAll('pre code, .code-block code');
            allCodeBlocks.forEach(block => {
                // Sauvegarder le code original avant highlight.js si pas déjà fait
                if (!block.getAttribute('data-original')) {
                    block.setAttribute('data-original', block.textContent || block.innerText);
                }
                hljs.highlightElement(block);
            });
            // Use a longer timeout to ensure highlight.js is done
            setTimeout(() => {
                addLineNumbers();
            }, 300);
        } else {
            new CodeHighlight();
            setTimeout(() => {
                addLineNumbers();
            }, 200);
        }
    }, 150);
});

// Also run when page is fully loaded (fallback)
window.addEventListener('load', () => {
    setTimeout(() => {
        addLineNumbers();
    }, 800);
});

// Force re-run after a delay to catch any late-loading content
setTimeout(() => {
    addLineNumbers();
}, 1000);


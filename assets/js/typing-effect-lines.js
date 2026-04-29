// Typing Effect avec effet de flux vertical - lignes qui apparaissent en bas et disparaissent en haut
class TypingEffectLines {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        const codeBlocks = document.querySelectorAll('.typing-code code');

        if (codeBlocks.length === 0) {
            return;
        }

        codeBlocks.forEach((codeElement, index) => {
            let originalCode = codeElement.getAttribute('data-original');
            
            if (!originalCode || originalCode === '') {
                originalCode = codeElement.textContent.trim();
            }
            
            if (!originalCode || originalCode === '') {
                originalCode = codeElement.innerText || codeElement.textContent || '';
            }
            
            const language = codeElement.className.match(/language-(\w+)/)?.[1] || 'php';

            if (originalCode && originalCode.length > 0) {
                codeElement.setAttribute('data-original', originalCode);
                codeElement.setAttribute('data-language', language);

                setTimeout(() => {
                    codeElement.textContent = '';
                    codeElement.innerHTML = '';
                    
                    setTimeout(() => {
                        this.typeCodeLines(codeElement, originalCode, language);
                    }, index * 800);
                }, 200);
            }
        });
    }

    typeCodeLines(element, code, language) {
        if (!code || code.length === 0) {
            const savedCode = element.getAttribute('data-original');
            if (savedCode) {
                element.textContent = savedCode;
                element.className = `language-${language}`;
                if (typeof hljs !== 'undefined') {
                    hljs.highlightElement(element);
                }
            }
            return;
        }

        const lines = code.split('\n');
        let currentLineIndex = 0;
        let isTyping = true;

        const typeNextLine = () => {
            if (!isTyping || currentLineIndex >= lines.length) {
                // Animation terminée - afficher toutes les lignes finales avec highlight
                const finalCode = lines.join('\n');
                element.textContent = finalCode;
                element.className = `language-${language}`;
                if (typeof hljs !== 'undefined') {
                    hljs.highlightElement(element);
                }
                isTyping = false;
                
                // Retirer le curseur
                const cursor = element.querySelector('.typing-cursor');
                if (cursor) {
                    cursor.style.opacity = '0';
                    setTimeout(() => cursor.remove(), 300);
                }
                
                // Retirer la classe typing-code
                setTimeout(() => {
                    const wrapper = element.closest('.typing-code');
                    if (wrapper) {
                        wrapper.classList.add('typing-complete');
                        setTimeout(() => {
                            wrapper.classList.remove('typing-code');
                            wrapper.classList.remove('typing-complete');
                        }, 500);
                    }
                }, 800);
                return;
            }

            // Afficher les lignes jusqu'à currentLineIndex
            const visibleLines = lines.slice(0, currentLineIndex + 1);
            const displayCode = visibleLines.join('\n');
            element.textContent = displayCode;
            element.className = `language-${language}`;

            // Highlight après chaque ligne ajoutée
            if (typeof hljs !== 'undefined') {
                try {
                    hljs.highlightElement(element);
                } catch (e) {
                    console.warn('Highlight.js error:', e);
                }
            }

            // Ajouter/retirer le curseur
            let cursor = element.querySelector('.typing-cursor');
            if (!cursor && currentLineIndex < lines.length) {
                cursor = document.createElement('span');
                cursor.className = 'typing-cursor';
                cursor.textContent = '▊';
                element.appendChild(cursor);
            }

            currentLineIndex++;

            // Vitesse variable selon la longueur de la ligne
            const line = lines[currentLineIndex - 1];
            const lineLength = line ? line.length : 50;
            const baseSpeed = 300; // ms par ligne
            const speed = Math.max(150, baseSpeed - (lineLength * 1));

            setTimeout(typeNextLine, speed);
        };

        // Démarrer l'animation
        typeNextLine();
    }
}

// Initialiser
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TypingEffectLines();
    });
} else {
    new TypingEffectLines();
}

// Fallback au chargement complet
window.addEventListener('load', () => {
    const codeBlocks = document.querySelectorAll('.typing-code code');
    codeBlocks.forEach(block => {
        const originalCode = block.getAttribute('data-original');
        if (block.textContent.trim() === '' && originalCode && originalCode.length > 0) {
            const language = block.getAttribute('data-language') || 'php';
            const typingEffect = new TypingEffectLines();
            typingEffect.typeCodeLines(block, originalCode, language);
        }
    });
});


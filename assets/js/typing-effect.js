// Typing Effect for Code Blocks - Version améliorée avec préservation des couleurs
class TypingEffect {
    constructor() {
        this.init();
    }

    init() {
        // Execute immediately when DOM is ready
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
            // Get original code immediately - before any other script modifies it
            let originalCode = codeElement.getAttribute('data-original');
            
            // If not stored, get from textContent (before highlight.js modifies it)
            if (!originalCode || originalCode === '') {
                originalCode = codeElement.textContent.trim();
            }
            
            // If still empty, try innerText
            if (!originalCode || originalCode === '') {
                originalCode = codeElement.innerText || codeElement.textContent || '';
            }
            
            const language = codeElement.className.match(/language-(\w+)/)?.[1] || 'php';

            // Store original code immediately
            if (originalCode && originalCode.length > 0) {
                codeElement.setAttribute('data-original', originalCode);
                codeElement.setAttribute('data-language', language);

                // Wait a bit then start typing
                setTimeout(() => {
                    // Clear the content to start typing
                    codeElement.textContent = '';
                    
                    // Start typing after a delay based on index
                    setTimeout(() => {
                        this.typeCode(codeElement, originalCode, language);
                    }, index * 800);
                }, 200);
            } else {
                // If no code found, don't clear - keep what's there
                console.warn('No code found for typing effect', codeElement);
            }
        });
    }

    typeCode(element, code, language) {
        if (!code || code.length === 0) {
            console.warn('No code to type');
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

        // Étape 1: Highlight le code complet pour obtenir le HTML coloré
        const tempElement = document.createElement('code');
        tempElement.className = `language-${language}`;
        tempElement.textContent = code;
        
        let highlightedHtml = '';
        if (typeof hljs !== 'undefined') {
            try {
                hljs.highlightElement(tempElement);
                highlightedHtml = tempElement.innerHTML;
            } catch (e) {
                console.warn('Highlight.js error:', e);
                highlightedHtml = code;
            }
        } else {
            highlightedHtml = code;
        }

        // Étape 2: Fonction pour tronquer le HTML jusqu'à N caractères de texte visible (version améliorée)
        const truncateHtmlAtTextLength = (html, maxLength) => {
            if (maxLength <= 0) return '';
            
            const container = document.createElement('div');
            container.innerHTML = html;
            
            let currentLength = 0;
            const openTagsStack = [];
            
            const processNode = (node) => {
                if (currentLength >= maxLength) return null;
                
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    const remaining = maxLength - currentLength;
                    if (remaining > 0) {
                        const textToTake = Math.min(text.length, remaining);
                        currentLength += textToTake;
                        return document.createTextNode(text.substring(0, textToTake));
                    }
                    return null;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    const isVoid = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'].includes(tagName);
                    
                    const clone = node.cloneNode(false);
                    const startLength = currentLength;
                    
                    // Traiter les enfants
                    for (let child of Array.from(node.childNodes)) {
                        if (currentLength >= maxLength) break;
                        const processed = processNode(child);
                        if (processed) {
                            clone.appendChild(processed);
                        }
                    }
                    
                    // Si on a ajouté du contenu, garder la balise
                    if (clone.childNodes.length > 0 || currentLength > startLength) {
                        if (!isVoid) {
                            openTagsStack.push(tagName);
                        }
                        return clone;
                    }
                    
                    return null;
                }
                return null;
            };
            
            const frag = document.createDocumentFragment();
            for (let child of Array.from(container.childNodes)) {
                if (currentLength >= maxLength) break;
                const processed = processNode(child);
                if (processed) {
                    frag.appendChild(processed);
                }
            }
            
            // Créer le HTML avec toutes les balises correctement fermées
            const tempDiv = document.createElement('div');
            tempDiv.appendChild(frag);
            let result = tempDiv.innerHTML;
            
            // Fermer les balises ouvertes restantes dans l'ordre inverse
            while (openTagsStack.length > 0) {
                const tag = openTagsStack.pop();
                result += `</${tag}>`;
            }
            
            return result;
        };

        let textIndex = 0;
        const speed = 35; // Vitesse plus lente pour éviter les bugs
        let isTyping = true;
        let currentTimeout = null;

        // Compter le nombre total de caractères de texte
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedHtml;
        const totalTextLength = (tempDiv.textContent || tempDiv.innerText || '').length;

        const restartAnimation = () => {
            // Réinitialiser pour relancer l'animation
            textIndex = 0;
            isTyping = true;
            element.textContent = '';
            
            // Relancer l'animation après un court délai
            setTimeout(() => {
                type();
            }, 300);
        };

        const type = () => {
            if (!isTyping) return;
            
            if (textIndex < totalTextLength) {
                textIndex++;
                
                // Extraire le HTML jusqu'à textIndex caractères
                const partialHtml = truncateHtmlAtTextLength(highlightedHtml, textIndex);
                
                // Utiliser requestAnimationFrame pour un rendu plus fluide et éviter les clignotements
                requestAnimationFrame(() => {
                    if (isTyping) {
                        element.innerHTML = partialHtml;
                    }
                });
                
                // Vitesse variable
                const currentChar = code[textIndex - 1] || '';
                const nextChar = code[textIndex] || '';
                let currentSpeed = speed;
                
                if (currentChar === '\n') {
                    currentSpeed = speed * 1.5; // Plus de temps après un saut de ligne
                } else if (nextChar === '\n') {
                    currentSpeed = speed * 1.2; // Légèrement plus rapide avant un saut de ligne
                } else if (currentChar === ' ') {
                    currentSpeed = speed * 0.9; // Légèrement plus rapide sur les espaces
                }
                
                if (currentTimeout) {
                    clearTimeout(currentTimeout);
                }
                currentTimeout = setTimeout(type, currentSpeed);
            } else {
                isTyping = false;
                // Afficher le HTML complet à la fin
                element.innerHTML = highlightedHtml;
                
                // Attendre 5 secondes avant de relancer l'animation
                setTimeout(() => {
                    const wrapper = element.closest('.typing-code');
                    if (wrapper) {
                        wrapper.classList.add('typing-complete');
                        setTimeout(() => {
                            wrapper.classList.remove('typing-complete');
                            // Relancer l'animation
                            restartAnimation();
                        }, 500);
                    } else {
                        // Si pas de wrapper, relancer directement
                        restartAnimation();
                    }
                }, 5000); // 5 secondes de pause avec le code complet affiché
            }
        };

        // Démarrer l'animation
        type();
        
        // Safety fallback - désactivé car l'animation se relance automatiquement
        // setTimeout(() => {
        //     if (isTyping) {
        //         console.warn('Typing effect timeout, showing full text');
        //         isTyping = false;
        //         element.innerHTML = highlightedHtml;
        //         const wrapper = element.closest('.typing-code');
        //         if (wrapper) {
        //             wrapper.classList.remove('typing-code');
        //         }
        //     }
        // }, (totalTextLength * speed) + 10000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TypingEffect();
    });
} else {
    new TypingEffect();
}

// Also try on window load as fallback
window.addEventListener('load', () => {
    // Check if there are blocks that haven't started typing yet
    const codeBlocks = document.querySelectorAll('.typing-code code');
    codeBlocks.forEach(block => {
        // If block is empty but has data-original, it means typing didn't start
        const originalCode = block.getAttribute('data-original');
        if (block.textContent.trim() === '' && originalCode && originalCode.length > 0) {
            const language = block.getAttribute('data-language') || 'php';
            const typingEffect = new TypingEffect();
            typingEffect.typeCode(block, originalCode, language);
        } else if (block.textContent.trim() === '' && !originalCode) {
            // If block is empty and no data-original, try to restore
            console.warn('Typing effect: block is empty and no original code found', block);
        }
    });
});

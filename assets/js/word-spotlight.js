// Word Spotlight Effect
class WordSpotlight {
    constructor(selector = '.word-spotlight') {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            this.processElement(element);
        });
    }

    processElement(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = '';
        
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'spotlight-word';
            wordSpan.textContent = word;
            wordSpan.style.opacity = '0.3';
            wordSpan.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
            wordSpan.style.filter = 'blur(2px)';
            
            // Add hover effect
            wordSpan.addEventListener('mouseenter', () => {
                this.highlightWord(wordSpan, element);
            });
            
            // Add auto-rotation effect
            if (element.dataset.autoRotate === 'true') {
                setInterval(() => {
                    if (index === Math.floor(Date.now() / 2000) % words.length) {
                        this.highlightWord(wordSpan, element);
                        setTimeout(() => {
                            wordSpan.style.opacity = '0.3';
                            wordSpan.style.filter = 'blur(2px)';
                        }, 1000);
                    }
                }, 2000);
            }
            
            element.appendChild(wordSpan);
            if (index < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
    }

    highlightWord(wordSpan, container) {
        // Reset all words
        container.querySelectorAll('.spotlight-word').forEach(word => {
            word.style.opacity = '0.3';
            word.style.filter = 'blur(2px)';
        });
        
        // Highlight current word
        wordSpan.style.opacity = '1';
        wordSpan.style.filter = 'blur(0px)';
        
        // Add glow effect
        const glow = document.createElement('span');
        glow.className = 'spotlight-glow';
        wordSpan.appendChild(glow);
        
        setTimeout(() => {
            if (glow.parentNode) {
                glow.remove();
            }
        }, 300);
    }
}

// Initialize Word Spotlight
document.addEventListener('DOMContentLoaded', () => {
    new WordSpotlight();
});


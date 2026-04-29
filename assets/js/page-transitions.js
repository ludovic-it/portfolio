// Page Transition System - Transitions fluides entre les pages
class PageTransitions {
    constructor() {
        this.transitionType = 'fade'; // fade, slide-left, slide-right, zoom-out
        this.transitionDuration = 400;
        this.init();
    }

    init() {
        // Créer l'élément de transition
        this.createTransitionElement();
        
        // Intercepter les clics sur les liens
        this.interceptLinks();
        
        // Gérer le chargement de la page
        this.handlePageLoad();
    }

    createTransitionElement() {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        transition.id = 'page-transition';
        document.body.appendChild(transition);
        this.transitionElement = transition;
    }

    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (!link) return;
            
            // Ignorer les liens externes, les ancres, et les liens spéciaux
            if (link.hostname !== window.location.hostname ||
                link.hash ||
                link.target === '_blank' ||
                link.hasAttribute('download') ||
                link.getAttribute('href')?.startsWith('mailto:') ||
                link.getAttribute('href')?.startsWith('tel:')) {
                return;
            }

            // Ignorer si c'est un lien JavaScript
            if (link.getAttribute('href')?.startsWith('javascript:')) {
                return;
            }

            e.preventDefault();
            this.transitionOut(link.href);
        });
    }

    transitionOut(url) {
        // Déterminer le type de transition selon la direction
        const currentPath = window.location.pathname;
        const targetPath = new URL(url, window.location.origin).pathname;
        
        // Animation de sortie
        this.transitionElement.classList.add('active');
        
        // Choisir le type de transition
        setTimeout(() => {
            this.transitionElement.classList.add(this.transitionType);
        }, 10);

        // Naviguer après l'animation
        setTimeout(() => {
            window.location.href = url;
        }, this.transitionDuration);
    }

    transitionIn() {
        // Animation d'entrée
        this.transitionElement.classList.remove('active');
        this.transitionElement.classList.remove(this.transitionType);
        
        // Ajouter l'animation de chargement de page
        document.body.classList.add('page-loaded');
        
        setTimeout(() => {
            document.body.classList.remove('page-loaded');
        }, 600);
    }

    handlePageLoad() {
        // Si la page est chargée depuis le cache, transition immédiate
        if (document.readyState === 'complete') {
            this.transitionIn();
        } else {
            window.addEventListener('load', () => {
                this.transitionIn();
            });
        }

        // Animation d'entrée au chargement
        document.addEventListener('DOMContentLoaded', () => {
            // Animer les éléments avec la classe animate-*
            this.animateOnLoad();
        });
    }

    animateOnLoad() {
        // Animer les titres principaux
        const titles = document.querySelectorAll('h1, h2.section-title');
        titles.forEach((title, index) => {
            title.classList.add('animate-slide-in-up');
            title.style.animationDelay = `${index * 0.1}s`;
        });

        // Animer les paragraphes
        const paragraphs = document.querySelectorAll('p, .section-sub');
        paragraphs.forEach((p, index) => {
            p.classList.add('animate-fade-in');
            p.style.animationDelay = `${0.3 + index * 0.1}s`;
        });

        // Animer les boutons
        const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
        buttons.forEach((btn, index) => {
            btn.classList.add('animate-fade-in-scale');
            btn.style.animationDelay = `${0.5 + index * 0.1}s`;
        });

        // Animer les cartes
        const cards = document.querySelectorAll('.skill-card-new, .project-card');
        cards.forEach((card, index) => {
            card.classList.add('animate-slide-in-up');
            card.style.animationDelay = `${0.2 + index * 0.05}s`;
        });
    }

    setTransitionType(type) {
        const validTypes = ['fade', 'slide-left', 'slide-right', 'zoom-out'];
        if (validTypes.includes(type)) {
            this.transitionType = type;
        }
    }
}

// Animation au scroll améliorée
class EnhancedScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerAnimation(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.observeElements();
        }
    }

    observeElements() {
        // Observer tous les éléments avec des classes d'animation
        document.querySelectorAll('[class*="animate-"]').forEach(el => {
            this.observer.observe(el);
        });

        // Observer les sections
        document.querySelectorAll('section').forEach(section => {
            this.observer.observe(section);
        });
    }

    triggerAnimation(element) {
        // Déclencher l'animation en ajoutant une classe
        element.classList.add('animate-triggered');
        
        // Animation spécifique selon la classe
        if (element.classList.contains('animate-slide-in-left')) {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        } else if (element.classList.contains('animate-slide-in-right')) {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        } else if (element.classList.contains('animate-slide-in-up')) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        } else if (element.classList.contains('animate-fade-in')) {
            element.style.opacity = '1';
        }
    }
}

// Animation de texte lettre par lettre
class TextReveal {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            element.classList.add('text-reveal');
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                element.appendChild(span);
            });
        });
    }
}

// Animation de vague pour le texte
class WaveText {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            element.classList.add('wave-text');
            
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                element.appendChild(span);
            });
        });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les transitions de page
    new PageTransitions();
    
    // Initialiser les animations au scroll
    new EnhancedScrollAnimations();
    
    // Animer les titres principaux avec effet de vague
    const mainTitles = document.querySelectorAll('.hero-name, .section-title');
    if (mainTitles.length > 0) {
        mainTitles.forEach(title => {
            title.classList.add('wave-text');
            new WaveText(title);
        });
    }
    
    // Animer les textes avec gradient
    const gradientTexts = document.querySelectorAll('.gradient-text');
    gradientTexts.forEach(text => {
        text.classList.add('gradient-text');
    });
});

// Exporter pour utilisation externe
window.PageTransitions = PageTransitions;
window.TextReveal = TextReveal;
window.WaveText = WaveText;


// Hero Parallax Effect
class HeroParallax {
    constructor() {
        this.heroSection = document.querySelector('.hero-header');
        this.heroContent = document.querySelector('.hero-content');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.lastScrollY = 0;
        this.ticking = false;
        
        if (this.heroSection) {
            this.init();
        }
    }
    
    init() {
        // Vérifier si l'utilisateur préfère les animations réduites
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        // Écouter le scroll pour le parallaxe
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
        
        // Ajouter l'animation progressive au nom
        this.initNameAnimation();
        
        // Gérer le clic sur l'indicateur de scroll
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(this.scrollIndicator.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
    
    updateParallax() {
        const scrollY = this.lastScrollY;
        const heroHeight = this.heroSection?.offsetHeight || 0;
        
        // Parallaxe léger sur le contenu (seulement si on est dans la section hero)
        if (scrollY < heroHeight && this.heroContent) {
            const parallaxValue = scrollY * 0.3; // Facteur de parallaxe doux
            this.heroContent.style.transform = `translateY(${parallaxValue}px)`;
            this.heroContent.style.opacity = 1 - (scrollY / heroHeight) * 0.3;
        } else if (this.heroContent) {
            this.heroContent.style.transform = '';
            this.heroContent.style.opacity = '';
        }
        
        // Cacher l'indicateur de scroll après un certain scroll
        if (this.scrollIndicator) {
            if (scrollY > 100) {
                this.scrollIndicator.style.opacity = '0';
                this.scrollIndicator.style.pointerEvents = 'none';
            } else {
                this.scrollIndicator.style.opacity = '';
                this.scrollIndicator.style.pointerEvents = '';
            }
        }
    }
    
    initNameAnimation() {
        const nameElements = document.querySelectorAll('.hero-name');
        if (nameElements.length === 0) return;
        
        // Ajouter l'animation fade-in progressive au chargement
        nameElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-progressive');
            }, index * 200); // Délai échelonné
        });
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    new HeroParallax();
});


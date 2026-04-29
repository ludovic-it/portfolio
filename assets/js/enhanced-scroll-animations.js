// Enhanced Scroll Animations - Système optimisé d'animations au scroll
// Respecte l'ordre de lecture gauche-droite pour la France

class EnhancedScrollAnimations {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateElement(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            });

            // Attendre que le DOM soit prêt
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.observeElements());
            } else {
                this.observeElements();
            }
        }
    }

    observeElements() {
        // Observer tous les éléments qui doivent être animés
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', '.section-title', '.section-sub',
            '.skill-card-new', '.project-card', '.card',
            '.about-text', '.contact-description',
            '.btn-primary', '.btn-outline',
            'section', '.reveal', '[data-reveal]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Ne pas animer les éléments déjà animés ou dans des modals
                if (!el.closest('.modal') && !el.closest('.bts-modal')) {
                    this.observer.observe(el);
                }
            });
        });
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };
    }

    getAnimationType(element) {
        // Déterminer le type d'animation selon la section et le type d'élément
        const tagName = element.tagName.toLowerCase();
        const classes = element.className;
        
        // Trouver la section parente
        const section = element.closest('section');
        const sectionClass = section ? section.className : '';
        
        // Section ABOUT : tout vient de la gauche
        if (sectionClass.includes('about-section') || 
            classes.includes('about-title') ||
            classes.includes('about-text') ||
            classes.includes('about-content') ||
            classes.includes('about-meta') ||
            classes.includes('about-label') ||
            classes.includes('about-link')) {
            return 'slide-in-left';
        }
        
        // Section BTS : tout vient de la droite
        if (sectionClass.includes('bts-section') || 
            classes.includes('bts-title') ||
            classes.includes('bts-text') ||
            classes.includes('bts-subtitle') ||
            classes.includes('bts-content') ||
            classes.includes('bts-meta') ||
            classes.includes('bts-label') ||
            classes.includes('bts-link')) {
            return 'slide-in-right';
        }
        
        // Tous les autres textes viennent de la gauche
        if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || 
            tagName === 'h4' || tagName === 'h5' || tagName === 'h6' ||
            tagName === 'p' || 
            classes.includes('section-title') || 
            classes.includes('section-sub') ||
            classes.includes('text') || 
            classes.includes('description') ||
            classes.includes('contact-description') ||
            classes.includes('title') ||
            classes.includes('subtitle')) {
            return 'slide-in-left';
        }

        // Toutes les cartes viennent de la droite
        if (classes.includes('card') || 
            classes.includes('skill-card') || 
            classes.includes('project-card') ||
            classes.includes('cert-card') ||
            classes.includes('skill-card-new') ||
            classes.includes('about-card') ||
            classes.includes('contact-form-card') ||
            classes.includes('quote-card')) {
            return 'slide-in-right';
        }

        // Boutons : fade-in-scale
        if (classes.includes('btn') || tagName === 'button' || tagName === 'a') {
            const isButton = classes.includes('btn-primary') || 
                           classes.includes('btn-outline') || 
                           classes.includes('btn-link');
            if (isButton) {
                return 'fade-in-scale';
            }
        }

        // Par défaut : fade-in
        return 'fade-in';
    }

    calculateDelay(element, index = 0) {
        // Calculer le délai selon la position verticale (haut en bas)
        // Les éléments apparaissent progressivement du haut vers le bas
        const position = this.getElementPosition(element);
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Délai vertical principal (haut en bas)
        const verticalDelay = ((position.top - scrollY) / viewportHeight) * 0.3;
        
        // Délai selon l'index dans un groupe (pour les cartes dans une grille)
        const indexDelay = index * 0.08;
        
        // Délai minimum pour éviter que tout apparaisse en même temps
        const baseDelay = 0.1;
        
        return Math.max(0, Math.min(verticalDelay + indexDelay + baseDelay, 1.2));
    }

    animateElement(element) {
        // Ne pas animer si déjà animé
        if (element.classList.contains('scroll-animated')) {
            return;
        }

        // Obtenir le type d'animation
        const animationType = this.getAnimationType(element);
        
        // Calculer le délai
        const siblings = Array.from(element.parentElement?.children || []);
        const index = siblings.indexOf(element);
        const delay = this.calculateDelay(element, index);

        // Ajouter les classes d'animation avec transition fluide
        element.classList.add('scroll-animated', `animate-${animationType}`);
        element.style.animationDelay = `${delay}s`;
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        // Définir l'état initial selon le type
        switch(animationType) {
            case 'slide-in-left':
                element.style.transform = 'translateX(-60px)';
                break;
            case 'slide-in-right':
                element.style.transform = 'translateX(60px)';
                break;
            case 'slide-in-up':
                element.style.transform = 'translateY(40px)';
                break;
            case 'slide-in-down':
                element.style.transform = 'translateY(-40px)';
                break;
            case 'fade-in':
                element.style.opacity = '0';
                break;
            case 'fade-in-scale':
                element.style.transform = 'scale(0.95)';
                element.style.opacity = '0';
                break;
            case 'zoom-in':
                element.style.transform = 'scale(0.9)';
                element.style.opacity = '0';
                break;
        }

        // Déclencher l'animation avec double requestAnimationFrame pour plus de fluidité
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                
                // Appliquer la transformation finale selon le type
                switch(animationType) {
                    case 'slide-in-left':
                    case 'slide-in-right':
                    case 'slide-in-up':
                    case 'slide-in-down':
                        element.style.transform = 'translate(0, 0)';
                        break;
                    case 'fade-in':
                        element.style.opacity = '1';
                        break;
                    case 'fade-in-scale':
                    case 'zoom-in':
                        element.style.transform = 'scale(1)';
                        element.style.opacity = '1';
                        break;
                }
            });
        });
    }

    // Animer les éléments dans un conteneur (cartes de droite, textes de gauche)
    animateContainer(container, staggerDelay = 0.08) {
        const children = Array.from(container.children);
        
        children.forEach((child, index) => {
            // Déterminer le type d'animation selon le type d'élément
            const animationType = this.getAnimationType(child);
            
            child.classList.add('scroll-animated', `animate-${animationType}`);
            child.style.animationDelay = `${index * staggerDelay}s`;
            child.style.opacity = '0';
            
            // Définir l'état initial selon le type
            if (animationType === 'slide-in-left') {
                child.style.transform = 'translateX(-60px)';
            } else if (animationType === 'slide-in-right') {
                child.style.transform = 'translateX(60px)';
            } else if (animationType === 'fade-in-scale') {
                child.style.transform = 'scale(0.9)';
            }
            
            requestAnimationFrame(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateX(0) scale(1)';
            });
        });
    }
}

// Système de transitions de page optimisé
class OptimizedPageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.transitionElement = null;
        this.init();
    }

    init() {
        // Créer l'élément de transition
        this.createTransitionElement();
        
        // Intercepter les liens seulement si pas déjà en transition
        document.addEventListener('click', (e) => {
            if (this.isTransitioning) {
                e.preventDefault();
                return;
            }

            const link = e.target.closest('a');
            if (!link) return;

            // Vérifier si c'est un lien interne valide
            if (this.isValidLink(link)) {
                e.preventDefault();
                this.transitionOut(link.href);
            }
        });

        // Animation d'entrée au chargement
        this.transitionIn();
    }

    createTransitionElement() {
        if (!document.getElementById('page-transition')) {
            const transition = document.createElement('div');
            transition.id = 'page-transition';
            transition.className = 'page-transition';
            document.body.appendChild(transition);
            this.transitionElement = transition;
        } else {
            this.transitionElement = document.getElementById('page-transition');
        }
    }

    isValidLink(link) {
        // Ignorer les liens externes, ancres, downloads, etc.
        if (link.hostname !== window.location.hostname) return false;
        if (link.hash) return false;
        if (link.target === '_blank') return false;
        if (link.hasAttribute('download')) return false;
        if (link.getAttribute('href')?.startsWith('mailto:')) return false;
        if (link.getAttribute('href')?.startsWith('tel:')) return false;
        if (link.getAttribute('href')?.startsWith('javascript:')) return false;
        if (link.getAttribute('href')?.startsWith('#')) return false;
        
        return true;
    }

    transitionOut(url) {
        this.isTransitioning = true;
        
        // Animation de sortie optimisée
        this.transitionElement.classList.add('active');
        
        // Utiliser requestAnimationFrame pour une transition fluide
        requestAnimationFrame(() => {
            this.transitionElement.style.opacity = '1';
            
            // Naviguer après un court délai
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        });
    }

    transitionIn() {
        // Animation d'entrée optimisée
        if (this.transitionElement) {
            // Retirer immédiatement la classe active
            this.transitionElement.classList.remove('active');
            this.transitionElement.style.opacity = '0';
            
            // Animer le body
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                document.body.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                document.body.style.opacity = '1';
                document.body.style.transform = 'translateY(0)';
                
                // Nettoyer après l'animation
                setTimeout(() => {
                    document.body.style.transition = '';
                    document.body.style.opacity = '';
                    document.body.style.transform = '';
                }, 400);
            });
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les animations au scroll
    window.scrollAnimations = new EnhancedScrollAnimations();
    
    // Initialiser les transitions de page
    window.pageTransitions = new OptimizedPageTransitions();
    
    // Animer les conteneurs de cartes de gauche à droite
    document.querySelectorAll('.skills-grid-container, .projects-grid, .certifications-grid').forEach(container => {
        window.scrollAnimations.animateContainer(container, 0.08);
    });
});

// Réinitialiser au changement de page (pour le cache)
if (document.readyState === 'complete') {
    window.scrollAnimations = new EnhancedScrollAnimations();
    window.pageTransitions = new OptimizedPageTransitions();
}


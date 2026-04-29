// Enhanced Loading Screen with Logo and Smooth Loading
(function() {
    'use strict';

    class LoadingScreen {
        constructor() {
            this.screen = null;
            this.progress = 0;
            this.minDisplayTime = 800; // Temps minimum d'affichage pour fluidité
            this.startTime = Date.now();
            this.resourcesLoaded = false;
            this.init();
        }

        init() {
            // Créer l'écran de chargement immédiatement
            this.createScreen();
            
            // Empêcher le scroll pendant le chargement
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // Démarrer les animations
            this.animate();
            
            // Gérer le chargement
            this.handleLoading();
        }

        createScreen() {
            this.screen = document.createElement('div');
            this.screen.className = 'loading-screen';
            this.screen.innerHTML = `
                <div class="loading-content">
                    <div class="loading-logo-wrapper">
                        <svg class="loading-logo-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                            <circle class="logo-circle" cx="60" cy="60" r="55" fill="none" stroke="currentColor" stroke-width="3"/>
                            <text class="logo-text" x="60" y="75" text-anchor="middle" font-family="FRICK, Inter, sans-serif" font-size="48" font-weight="800" fill="currentColor">LC</text>
                            <circle class="logo-pulse" cx="60" cy="60" r="55" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                        </svg>
                    </div>
                    <div class="loading-bar-container">
                        <div class="loading-bar"></div>
                    </div>
                    <p class="loading-text">
                        <span class="loading-dots">
                            <span>.</span><span>.</span><span>.</span>
                        </span>
                    </p>
                </div>
            `;
            
            // Insérer au début du body pour être au-dessus de tout
            document.body.insertBefore(this.screen, document.body.firstChild);
        }

        animate() {
            const bar = this.screen.querySelector('.loading-bar');
            if (!bar) return;

            // Animation de progression fluide
            const updateProgress = () => {
                // Simulation de progression basée sur les ressources
                const resourceProgress = this.getResourceProgress();
                
                // Progression plus lente au début, plus rapide à la fin
                if (this.progress < resourceProgress) {
                    const increment = Math.max(0.5, (resourceProgress - this.progress) * 0.1);
                    this.progress = Math.min(this.progress + increment, resourceProgress, 100);
                } else if (this.resourcesLoaded && this.progress < 100) {
                    // Finir jusqu'à 100% une fois les ressources chargées
                    this.progress = Math.min(this.progress + 2, 100);
                }
                
                bar.style.width = this.progress + '%';
                
                // Continuer jusqu'à 100%
                if (this.progress < 100) {
                    requestAnimationFrame(updateProgress);
                }
            };

            requestAnimationFrame(updateProgress);
        }

        getResourceProgress() {
            if (document.readyState === 'complete') {
                return 100;
            } else if (document.readyState === 'interactive') {
                return 70;
            } else {
                return 30;
            }
        }

        handleLoading() {
            // Vérifier si les ressources sont déjà chargées
            if (document.readyState === 'complete') {
                this.resourcesLoaded = true;
                this.hide();
                return;
            }

            // Écouter l'événement load
            window.addEventListener('load', () => {
                this.resourcesLoaded = true;
                // Attendre que la progression atteigne au moins 90% avant de cacher
                const checkProgress = setInterval(() => {
                    if (this.progress >= 90) {
                        clearInterval(checkProgress);
                        this.hide();
                    }
                }, 100);
            });

            // Écouter les changements d'état du document
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'complete') {
                    this.resourcesLoaded = true;
                }
            });

            // Timeout de sécurité (4 secondes max)
            setTimeout(() => {
                this.resourcesLoaded = true;
                this.progress = 100;
                this.hide();
            }, 4000);
        }

        hide() {
            // Attendre le temps minimum d'affichage pour fluidité
            const elapsedTime = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);

            setTimeout(() => {
                if (!this.screen || !this.screen.parentNode) return;

                // Animation de sortie
                this.screen.classList.add('fade-out');

                setTimeout(() => {
                    if (this.screen && this.screen.parentNode) {
                        this.screen.remove();
                    }
                    
                    // Restaurer le scroll
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    
                    // Déclencher un événement pour indiquer que le chargement est terminé
                    window.dispatchEvent(new CustomEvent('loadingComplete'));
                }, 500);
            }, remainingTime);
        }
    }

    // Initialiser immédiatement (avant que le DOM soit prêt si possible)
    let loadingScreen = null;
    
    if (document.body) {
        loadingScreen = new LoadingScreen();
    } else {
        // Si le body n'existe pas encore, attendre un peu
        const initInterval = setInterval(() => {
            if (document.body) {
                clearInterval(initInterval);
                loadingScreen = new LoadingScreen();
            }
        }, 10);
    }

    // Exposer pour utilisation externe si besoin
    window.loadingScreen = loadingScreen;
})();


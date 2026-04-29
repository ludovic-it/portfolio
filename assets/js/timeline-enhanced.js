// Enhanced Timeline Animations
(function() {
    'use strict';

    class TimelineEnhanced {
        constructor() {
            this.timelineLine = null;
            this.timelineMarkers = [];
            this.timelineCards = [];
            this.observer = null;
            this.init();
        }

        init() {
            // Trouver les éléments de timeline
            this.timelineLine = document.getElementById('timelineLine');
            if (!this.timelineLine) return;

            this.timelineMarkers = Array.from(document.querySelectorAll('.timeline-marker'));
            this.timelineCards = Array.from(document.querySelectorAll('.timeline-card'));

            // Ne plus animer la ligne de timeline ici (gérée par timeline-scroll.js)
            // this.animateTimelineLine();

            // Observer les cartes pour les animations de révélation
            this.setupIntersectionObserver();

            // Animer les icônes
            this.animateIcons();
        }

        // Fonction pour mettre à jour la position de la ligne
        updateLinePosition() {
            if (!this.timelineLine || this.timelineMarkers.length < 1) {
                if (this.timelineLine) this.timelineLine.style.display = 'none';
                return;
            }

            const firstMarker = this.timelineMarkers[0];
            const lastMarker = this.timelineMarkers[this.timelineMarkers.length - 1];

            if (!firstMarker || !lastMarker) {
                this.timelineLine.style.display = 'none';
                return;
            }

            // Obtenir les positions absolues des marqueurs
            const timelineContainer = document.querySelector('.timeline-container');
            if (!timelineContainer) return;

            const containerRect = timelineContainer.getBoundingClientRect();
            const firstRect = firstMarker.getBoundingClientRect();
            const lastRect = lastMarker.getBoundingClientRect();

            // Calculer les positions relatives au conteneur
            const firstTop = firstRect.top - containerRect.top;
            const lastTop = lastRect.top - containerRect.top;
            
            // La ligne commence au centre du premier marqueur et se termine au centre du dernier
            const lineTop = firstTop + (firstRect.height / 2);
            const lineBottom = lastTop + (lastRect.height / 2);
            const lineHeight = Math.max(0, lineBottom - lineTop);

            // Positionner et dimensionner la ligne (relative au conteneur)
            this.timelineLine.style.top = `${lineTop}px`;
            this.timelineLine.style.height = `${lineHeight}px`;
            this.timelineLine.style.display = 'block';
            this.timelineLine.style.opacity = '0.5';
        }

        // Animation de dessin pour la ligne de timeline
        animateTimelineLine() {
            if (!this.timelineLine || this.timelineMarkers.length === 0) return;

            // Mettre à jour au chargement (avec délai pour s'assurer que le DOM est prêt)
            const initUpdate = () => {
                this.updateLinePosition();
            };

            // Attendre que le DOM soit complètement chargé
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(initUpdate, 200);
                });
            } else {
                setTimeout(initUpdate, 200);
            }

            // Mettre à jour au scroll et resize
            let ticking = false;
            const handleUpdate = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateLinePosition();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('resize', handleUpdate, { passive: true });
            window.addEventListener('scroll', handleUpdate, { passive: true });
        }

        // Calculer la hauteur totale de la timeline
        calculateTimelineHeight() {
            if (this.timelineMarkers.length < 2) return 100;

            const firstMarker = this.timelineMarkers[0];
            const lastMarker = this.timelineMarkers[this.timelineMarkers.length - 1];

            if (!firstMarker || !lastMarker) return 100;

            const firstRect = firstMarker.getBoundingClientRect();
            const lastRect = lastMarker.getBoundingClientRect();
            const scrollY = window.scrollY;

            return Math.abs((lastRect.top + scrollY) - (firstRect.top + scrollY));
        }

        // Configuration de l'Intersection Observer pour les cartes
        setupIntersectionObserver() {
            const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));
            
            if (!('IntersectionObserver' in window)) {
                // Fallback : rendre toutes les cartes visibles immédiatement
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 150);
                });
                return;
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Ajouter la classe visible à l'item parent
                        entry.target.classList.add('visible');
                        
                        // Animer la carte
                        const card = entry.target.querySelector('.timeline-card');
                        if (card) {
                            this.animateCard(card);
                        }
                        
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observer les timeline-items au lieu des cartes
            timelineItems.forEach(item => {
                this.observer.observe(item);
            });
        }

        // Animer une carte individuelle
        animateCard(card) {
            card.classList.add('timeline-card-animated');

            // Animation de scale et fade (mais ne pas forcer opacity à 0 car le parent gère déjà l'opacité)
            const item = card.closest('.timeline-item');
            if (item && !item.classList.contains('visible')) {
                return; // Ne pas animer si l'item n'est pas visible
            }

            // Animation subtile
            card.style.transform = 'scale(0.98)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    card.style.transform = 'scale(1)';
                });
            });

            // Animer le marqueur associé
            const marker = card.parentElement?.querySelector('.timeline-marker');
            if (marker) {
                this.animateMarker(marker);
            }
        }

        // Animer un marqueur
        animateMarker(marker) {
            marker.classList.add('timeline-marker-animated');

            // Animation de scale avec pulsation
            marker.style.transform = 'scale(0)';
            marker.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

            requestAnimationFrame(() => {
                marker.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    marker.style.transform = 'scale(1)';
                }, 300);
            });
        }

        // Animer les icônes dans les cartes
        animateIcons() {
            this.timelineCards.forEach(card => {
                const icons = card.querySelectorAll('i[class*="fa-"]');
                icons.forEach((icon, index) => {
                    icon.style.opacity = '0';
                    icon.style.transform = 'translateY(10px) rotate(-10deg)';
                    icon.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

                    // Observer chaque carte pour animer les icônes quand elle apparaît
                    const cardObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    icon.style.opacity = '1';
                                    icon.style.transform = 'translateY(0) rotate(0deg)';
                                }, index * 100);
                                cardObserver.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.3 });

                    cardObserver.observe(card);
                });
            });
        }

        // Mettre à jour la ligne de timeline au scroll (comportement existant amélioré)
        updateTimelineOnScroll() {
            if (!this.timelineLine || this.timelineMarkers.length === 0) return;

            // Mettre à jour la position de la ligne
            this.updateLinePosition();

            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            // Trouver le marqueur actif basé sur la position de scroll
            let activeIndex = -1;
            this.timelineMarkers.forEach((marker, index) => {
                const rect = marker.getBoundingClientRect();
                const markerTop = rect.top + scrollY;

                // Activer si le marqueur est dans la zone visible
                if (markerTop <= scrollY + viewportHeight * 0.6) {
                    activeIndex = index;
                }
            });

            // Mettre à jour les classes actives
            this.timelineMarkers.forEach((marker, index) => {
                if (index <= activeIndex) {
                    marker.classList.add('active');
                    const item = marker.closest('.timeline-item');
                    if (item) {
                        item.classList.add('active');
                    }
                } else {
                    marker.classList.remove('active');
                    const item = marker.closest('.timeline-item');
                    if (item) {
                        item.classList.remove('active');
                    }
                }
            });
        }
    }

    // Initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.timelineEnhanced = new TimelineEnhanced();
            
            // Mettre à jour au scroll
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        if (window.timelineEnhanced) {
                            window.timelineEnhanced.updateTimelineOnScroll();
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            // Mettre à jour au resize
            window.addEventListener('resize', () => {
                if (window.timelineEnhanced) {
                    window.timelineEnhanced.animateTimelineLine();
                }
            }, { passive: true });
        });
    } else {
        window.timelineEnhanced = new TimelineEnhanced();
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.timelineEnhanced) {
                        window.timelineEnhanced.updateTimelineOnScroll();
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (window.timelineEnhanced) {
                window.timelineEnhanced.animateTimelineLine();
            }
        }, { passive: true });
    }

    // Exposer pour utilisation externe
    window.TimelineEnhanced = TimelineEnhanced;
})();



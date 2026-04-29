// Timeline scroll animation - Barre de progression simple
document.addEventListener('DOMContentLoaded', function () {
    const timelineLine = document.getElementById('timelineLine');
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineLine || !timelineProgress || timelineItems.length === 0) {
        return;
    }

    function updateTimeline() {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Trouver le premier et dernier élément de la timeline
        const firstItem = timelineItems[0];
        const lastItem = timelineItems[timelineItems.length - 1];

        if (!firstItem || !lastItem) return;

        // Trouver le premier marqueur
        const firstMarker = firstItem.querySelector('.timeline-marker');
        if (!firstMarker) return;
        
        const firstMarkerRect = firstMarker.getBoundingClientRect();
        const firstMarkerTop = firstMarkerRect.top + scrollTop;
        
        // Utiliser le bas de la dernière carte
        const lastItemRect = lastItem.getBoundingClientRect();
        const lastItemBottom = lastItemRect.bottom + scrollTop;

        // Calculer la progression basée sur le scroll
        const viewportBottom = scrollTop + windowHeight;
        const timelineStart = firstMarkerTop;
        const timelineEnd = lastItemBottom;
        
        // Calculer le pourcentage de progression
        let progress = 0;
        if (viewportBottom >= timelineStart) {
            const scrolledDistance = viewportBottom - timelineStart;
            const totalDistance = timelineEnd - timelineStart;
            progress = Math.min(Math.max(scrolledDistance / totalDistance, 0), 1);
        }

        // Mettre à jour la hauteur de la barre de progression
        const timelineHeight = timelineEnd - timelineStart;
        const progressHeight = progress * timelineHeight;
        timelineProgress.style.height = progressHeight + 'px';
        
        // Positionner la ligne au bon endroit
        const container = document.querySelector('.timeline-container');
        if (container) {
            const containerRect = container.getBoundingClientRect();
            const containerTop = containerRect.top + scrollTop;
            const relativeTop = firstMarkerTop - containerTop;
            timelineLine.style.top = relativeTop + 'px';
            timelineLine.style.height = timelineHeight + 'px';
        }

        // Activer les marqueurs et items au scroll avec opacité progressive
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemTop = rect.top + scrollTop;
            const itemBottom = rect.bottom + scrollTop;
            const marker = item.querySelector('.timeline-marker');
            const card = item.querySelector('.timeline-card');

            if (marker) {
                // Calculer l'opacité basée sur la position dans le viewport
                const viewportTop = scrollTop;
                const viewportBottom = scrollTop + windowHeight;
                const viewportCenter = scrollTop + windowHeight / 2;
                
                // Distance depuis le centre du viewport jusqu'au centre de la carte
                const cardCenter = itemTop + (itemBottom - itemTop) / 2;
                const distanceFromViewportCenter = Math.abs(cardCenter - viewportCenter);
                
                // Calculer l'opacité : plus la carte est proche du centre, plus elle est opaque
                let opacity = 0;
                
                // Zone d'activation : quand la carte entre dans le viewport
                if (itemBottom > viewportTop && itemTop < viewportBottom) {
                    // Distance maximale pour commencer à voir la carte (1.5x la hauteur du viewport)
                    const maxDistance = windowHeight * 1.5;
                    
                    // Calculer l'opacité basée sur la distance
                    if (distanceFromViewportCenter < maxDistance) {
                        // Opacité progressive : 0 à maxDistance -> 1 à 0
                        opacity = 1 - (distanceFromViewportCenter / maxDistance);
                        opacity = Math.max(0, Math.min(1, opacity));
                        
                        // Augmenter l'opacité quand la carte est proche du centre
                        if (distanceFromViewportCenter < windowHeight * 0.3) {
                            opacity = Math.max(opacity, 0.95);
                        }
                    }
                }
                
                // Appliquer l'opacité à la carte
                if (card) {
                    card.style.opacity = opacity;
                    card.style.transition = 'opacity 0.3s ease';
                }
                
                // Activer les marqueurs
                if (viewportCenter >= itemTop - 100) {
                    marker.classList.add('active');
                    item.classList.add('active');
                } else {
                    marker.classList.remove('active');
                    item.classList.remove('active');
                }
            }
        });
    }

    // Mettre à jour au scroll avec throttling
    let ticking = false;
    function requestUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateTimeline();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    // Initialiser
    setTimeout(() => {
        updateTimeline();
    }, 100);
    
    updateTimeline();
});

// Collapsible Text Component - Un seul bouton "Voir plus" par card
(function() {
    'use strict';
    
    function initCollapsible() {
        // Sélecteurs des cards qui peuvent avoir du contenu collapsible
        const cardSelectors = [
            '.about-content',
            '.about-me',
            '.bts-main-card',
            '.bts-option-card'
        ];
        
        cardSelectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            
            cards.forEach(card => {
                // Ignorer si la card a l'attribut data-collapsible="false"
                if (card.hasAttribute('data-collapsible') && card.getAttribute('data-collapsible') === 'false') {
                    return;
                }
                
                // Ignorer si déjà traité
                if (card.querySelector('.collapsible-container')) {
                    return;
                }
                
                // Trouver tous les paragraphes dans la card
                const paragraphs = card.querySelectorAll('p');
                
                if (paragraphs.length === 0) {
                    return;
                }
                
                // Calculer la longueur totale du texte
                let totalLength = 0;
                paragraphs.forEach(p => {
                    totalLength += p.textContent.trim().length;
                });
                
                // Si le contenu est assez long (plus de 300 caractères), créer un container collapsible
                if (totalLength > 100) {
                    // Trouver où insérer le container (avant le premier paragraphe)
                    const firstParagraph = paragraphs[0];
                    const parent = firstParagraph.parentNode;
                    
                    // Créer le container
                    const container = document.createElement('div');
                    container.className = 'collapsible-container collapsible-auto';
                    
                    // Créer le contenu qui contiendra tous les paragraphes
                    const content = document.createElement('div');
                    content.className = 'collapsible-content';
                    
                    // Insérer le container avant le premier paragraphe
                    parent.insertBefore(container, firstParagraph);
                    
                    // Déplacer tous les paragraphes dans le container de contenu
                    paragraphs.forEach((p) => {
                        content.appendChild(p);
                    });
                    
                    // Créer le bouton toggle
                    const toggle = document.createElement('button');
                    toggle.className = 'collapsible-toggle';
                    toggle.type = 'button';
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.innerHTML = '<span data-i18n="common.seeMore">Voir plus</span> <i class="fas fa-chevron-down"></i>';
                    
                    // Ajouter l'event listener au toggle
                    toggle.addEventListener('click', function handleToggle(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const span = toggle.querySelector('span');
                        const isExpanded = container.classList.contains('expanded');
                        
                        if (isExpanded) {
                            // Fermer
                            container.classList.remove('expanded');
                            toggle.classList.remove('expanded');
                            toggle.setAttribute('aria-expanded', 'false');
                            if (span) {
                                span.setAttribute('data-i18n', 'common.seeMore');
                                // Mettre à jour via le système multilingue si disponible
                                if (window.i18n) {
                                    span.textContent = window.i18n.t('common.seeMore');
                                } else {
                                    span.textContent = 'Voir plus';
                                }
                            }
                        } else {
                            // Ouvrir
                            container.classList.add('expanded');
                            toggle.classList.add('expanded');
                            toggle.setAttribute('aria-expanded', 'true');
                            if (span) {
                                span.setAttribute('data-i18n', 'common.seeLess');
                                // Mettre à jour via le système multilingue si disponible
                                if (window.i18n) {
                                    span.textContent = window.i18n.t('common.seeLess');
                                } else {
                                    span.textContent = 'Voir moins';
                                }
                            }
                        }
                    });
                    
                    // Ajouter le contenu et le bouton au container
                    container.appendChild(content);
                    container.appendChild(toggle);
                }
            });
        });
    }
    
    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCollapsible);
    } else {
        initCollapsible();
    }
})();


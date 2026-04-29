// Button Enhancements - Ripple Effect and Loading State
(function() {
    'use strict';

    // Fonction pour créer l'effet ripple
    function createRipple(event) {
        const button = event.currentTarget;
        
        // Créer l'élément ripple
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        // Calculer la position du clic
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        // Définir les styles
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Ajouter au bouton
        button.appendChild(ripple);
        
        // Activer l'animation
        requestAnimationFrame(() => {
            ripple.classList.add('active');
        });
        
        // Retirer après l'animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Ajouter le ripple effect à tous les boutons
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-outline, button:not([type="submit"]):not(.nav-toggle)');
        
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
        });
    }

    // Fonction pour ajouter l'état loading
    function setLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.removeAttribute('aria-busy');
        }
    }

    // Exposer la fonction pour utilisation externe
    window.ButtonEnhancements = {
        setLoading: setLoading
    };

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRippleEffect);
    } else {
        initRippleEffect();
    }

    // Exemple d'utilisation pour les formulaires
    document.addEventListener('submit', function(e) {
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitButton && !submitButton.hasAttribute('data-no-loading')) {
            setLoading(submitButton, true);
            
            // Réinitialiser après un délai (normalement géré par le submit)
            // Pour les formulaires normaux, vous pouvez désactiver cette ligne
            // et gérer le loading dans votre callback de soumission
            setTimeout(() => {
                setLoading(submitButton, false);
            }, 3000);
        }
    });
})();



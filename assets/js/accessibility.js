// Accessibility Enhancements
class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        // this.addSkipLinks(); // Désactivé - bouton retiré
        this.enhanceKeyboardNavigation();
        this.improveFocusIndicators();
        this.addARIALabels();
        this.handleFocusTrapping();
    }

    addSkipLinks() {
        // Skip to main content link - DÉSACTIVÉ
        // const skipLink = document.createElement('a');
        // skipLink.href = '#main-content';
        // skipLink.className = 'skip-link';
        // skipLink.textContent = 'Aller au contenu principal';
        // skipLink.addEventListener('click', (e) => {
        //     e.preventDefault();
        //     const main = document.querySelector('main, [role="main"]') || document.querySelector('.container');
        //     if (main) {
        //         main.setAttribute('tabindex', '-1');
        //         main.focus();
        //         main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        //     }
        // });
        // document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceKeyboardNavigation() {
        // Improve navbar keyboard navigation
        const navLinks = document.querySelectorAll('.nav-link, .nav-contact');
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const next = navLinks[index + 1] || navLinks[0];
                    next.focus();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prev = navLinks[index - 1] || navLinks[navLinks.length - 1];
                    prev.focus();
                }
            });
        });

        // Close mobile menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.querySelector('.nav-menu.active');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    const toggle = document.querySelector('.nav-toggle');
                    if (toggle) toggle.focus();
                }
            }
        });
    }

    improveFocusIndicators() {
        // Ensure all interactive elements have visible focus
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 3px solid var(--primary-color, #4A7FFF);
                outline-offset: 2px;
                border-radius: 4px;
            }
            
            .skip-link {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    addARIALabels() {
        // Add ARIA labels to buttons without text
        document.querySelectorAll('button:not([aria-label]):not(:has(span)):not(:has(> text))').forEach(btn => {
            if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
                const icon = btn.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    if (iconClass.includes('bars')) {
                        btn.setAttribute('aria-label', 'Menu de navigation');
                    } else if (iconClass.includes('times') || iconClass.includes('close')) {
                        btn.setAttribute('aria-label', 'Fermer');
                    }
                }
            }
        });

        // Add ARIA labels to icon links
        document.querySelectorAll('a:has(> i.fas):not([aria-label])').forEach(link => {
            const icon = link.querySelector('i');
            if (icon && !link.textContent.trim()) {
                const iconClass = icon.className;
                if (iconClass.includes('github')) {
                    link.setAttribute('aria-label', 'Profil GitHub');
                } else if (iconClass.includes('linkedin')) {
                    link.setAttribute('aria-label', 'Profil LinkedIn');
                }
            }
        });
    }

    handleFocusTrapping() {
        // Trap focus in modals (if any)
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('[role="dialog"][aria-hidden="false"]');
            if (modal && e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Accessibility();
});


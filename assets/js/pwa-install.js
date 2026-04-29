// PWA Installation Prompt
class PWAInstall {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.init();
    }

    init() {
        // Vérifier si on est sur mobile
        if (this.isMobile()) {
            this.createInstallButton();
        }

        // Écouter l'événement beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Détecter si l'app est déjà installée
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed');
            this.hideInstallButton();
            this.deferredPrompt = null;
        });

        // Vérifier si l'app est déjà installée (pour iOS)
        if (window.navigator.standalone === true) {
            this.hideInstallButton();
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }

    createInstallButton() {
        const button = document.createElement('button');
        button.id = 'pwa-install-button';
        button.className = 'pwa-install-btn';
        button.innerHTML = '<i class="fas fa-download"></i> Installer l\'app';
        button.setAttribute('aria-label', 'Installer l\'application');
        
        button.addEventListener('click', () => this.promptInstall());
        
        document.body.appendChild(button);
        this.installButton = button;
        this.hideInstallButton(); // Caché par défaut
    }

    showInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'flex';
            this.installButton.classList.add('show');
        }
    }

    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
            this.installButton.classList.remove('show');
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            // Instructions pour installation manuelle (iOS)
            if (this.isIOS()) {
                this.showIOSInstructions();
                return;
            }
            return;
        }

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`User response: ${outcome}`);
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    showIOSInstructions() {
        const modal = document.createElement('div');
        modal.className = 'pwa-install-modal';
        modal.innerHTML = `
            <div class="pwa-install-modal-content">
                <h3>Installer l'application</h3>
                <p>Pour installer cette application sur iOS:</p>
                <ol>
                    <li>Appuyez sur le bouton <strong>Partager</strong> <i class="fas fa-share"></i></li>
                    <li>Sélectionnez <strong>Sur l'écran d'accueil</strong></li>
                </ol>
                <button class="btn-primary close-modal">Fermer</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/assets/js/service-worker.js', { scope: '/' })
            .then((registration) => {
                console.log('Service Worker registered:', registration);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Initialiser PWA Install
document.addEventListener('DOMContentLoaded', () => {
    new PWAInstall();
});


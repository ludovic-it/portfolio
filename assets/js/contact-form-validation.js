// Contact Form Validation avec feedback visuel
class ContactFormValidation {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validation en temps réel
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    this.validateField(input);
                }
            });
        });
        
        // Soumission du formulaire
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Validation selon le type
        if (field.type === 'email') {
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        } else if (field.required) {
            isValid = value.length > 0;
        }
        
        // Appliquer les classes
        field.classList.remove('valid', 'invalid');
        if (value.length > 0) {
            field.classList.add(isValid ? 'valid' : 'invalid');
        }
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Valider tous les champs
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });
        
        if (!allValid) {
            return;
        }
        
        // Afficher le message de succès
        this.showSuccessMessage();
        
        // Soumettre le formulaire (Formspree gère la soumission)
        // On laisse Formspree gérer la soumission réelle
        const formData = new FormData(this.form);
        fetch(this.form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                this.form.reset();
                // Les classes sont déjà gérées par showSuccessMessage
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }
    
    showSuccessMessage() {
        // Créer le message de succès s'il n'existe pas
        let successMsg = document.querySelector('.form-success');
        
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <div class="form-success-icon">✓</div>
                <h3>Message envoyé !</h3>
                <p>Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
            `;
            document.body.appendChild(successMsg);
        }
        
        successMsg.classList.add('show');
        
        // Fermer après 3 secondes
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 3000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormValidation();
});

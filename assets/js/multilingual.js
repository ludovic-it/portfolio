// Multilingual System (FR/EN)
class Multilingual {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.translations = {};
        this.init();
    }

    init() {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'multilingual.js:9',message:'Multilingual init',data:{currentLang:this.currentLang,url:window.location.href,readyState:document.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        this.loadTranslations();
        // this.createLanguageSwitcher(); // Désactivé - sélecteur uniquement dans le footer
        this.createFooterLanguageSwitcher();
        this.applyLanguage(this.currentLang);
    }

    loadTranslations() {
        this.translations = {
            fr: {
                // Navigation
                'nav.profil': 'Profil',
                'nav.projets': 'Projets',
                'nav.parcours': 'Parcours',
                'nav.stages': 'Stages',
                'nav.veille': 'Veille',
                'nav.contact': 'Contact',
                'nav.competences': 'Compétences',
                
                // Index - Hero
                'hero.title': 'Bonjour, Bienvenue sur mon',
                'hero.portfolio': 'Portfolio',
                'hero.subtitle': 'Je suis Ludovic CHAMPROBERT, étudiant en informatique.',
                'hero.contact': 'Me contacter',
                'hero.cv': 'Mon CV',
                'hero.role': 'Étudiant en informatique',
                
                // Index - About
                'about.title': 'À propos de moi',
                'about.label': 'PROFIL',
                'about.text1': 'Actuellement en formation pour devenir développeur d\'applications, je suis passionné par la création de solutions numériques innovantes. Mon parcours unique, combinant une expérience militaire au 40ème Régiment de Transmission et une reconversion dans le développement, m\'a permis de développer une solide éthique de travail et des compétences en résolution de problèmes.',
                'about.text2': 'Ma passion pour la programmation s\'exprime à travers divers projets, notamment en PHP/Symfony et le développement web. Je m\'intéresse particulièrement à la cybersécurité et au développement d\'applications sécurisées.',
                
                // Index - Projects
                'projects.title': 'Mes Projets',
                'projects.subtitle': 'Découvrez mes réalisations récentes et mes projets en cours.',
                'projects.scroll': 'Scroller pour explorer',
                
                // Index - Stats
                'stats.title': 'En Chiffres',
                
                // Index - Skills
                'skills.title': 'Mes Compétences',
                'skills.subtitle': 'Défilez pour explorer mon expertise technique',
                'skills.frontend.title': 'Frontend',
                'skills.frontend.description': 'Création d\'interfaces utilisateurs dynamiques, réactives et accessibles avec les standards du web moderne.',
                'skills.backend.title': 'Backend',
                'skills.backend.description': 'Développement d\'architectures serveurs robustes, API RESTful et bases de données optimisées.',
                'skills.software.title': 'Logiciel',
                'skills.software.description': 'Conception d\'algorithmes complexes et développement d\'applications logicielles orientées objet.',
                'skills.devops.title': 'DevOps',
                'skills.devops.description': 'Automatisation des déploiements, conteneurisation et gestion de versions pour les équipes agiles.',
                'skills.cms.title': 'CMS',
                'skills.cms.description': 'Déploiement et personnalisation de systèmes de gestion de contenu pour des sites vitrines et e-commerce.',
                'skills.certs.title': 'Certifs',
                'skills.certs.description': 'Compétences techniques validées par des organismes de formation reconnus.',
                
                // Common
                'common.seeMore': 'Voir plus',
                'common.seeLess': 'Voir moins',
                'common.viewProject': 'Voir le projet',
                'common.viewReport': 'Voir le rapport de stage',
                
                // Index - Certifications
                'certifications.title': 'Mes Certifications',
                
                // Projets page
                'projets.scroll': 'SCROLLER POUR EXPLORER ->',
                
                // Contact page
                'contact.title': 'Contact.',
                'contact.description': 'Je serais ravi d\'avoir de vos nouvelles. Envoyez-moi un message et commençons la conversation.',
                'contact.quote': 'De la rigueur militaire à la créativité du code, mon parcours atypique est ma plus grande force. Il me permet d\'aborder le développement logiciel avec discipline, précision et esprit d\'innovation.',
                'contact.author': 'Ludovic CHAMPROBERT',
                'contact.role': 'Développeur BTS SIO',
                'contact.form.name': 'Nom',
                'contact.form.name.placeholder': 'Entrez votre nom',
                'contact.form.email': 'Email',
                'contact.form.email.placeholder': 'Entrez votre email',
                'contact.form.message': 'Message',
                'contact.form.message.placeholder': 'Ecrivez votre message',
                'contact.form.submit': 'Envoyez',
                'contact.form.sending': 'Envoi en cours...',
                'contact.success': 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.',
                
                // Footer
                'footer.copyright': '© 2025 Ludovic CHAMPROBERT',
                'footer.credits': 'Site développé avec l\'assistance de GitHub Copilot',
                'footer.privacy': 'Politique de confidentialité',
                'footer.cookies': 'Politique des cookies',
                'footer.legal': 'Mentions légales',
                'footer.backToTop': 'Retour en haut',
                
                // Projets détaillés
                'project.ecommerce.title': 'Site E-commerce',
                'project.ecommerce.category': 'Développement Fullstack; Symfony',
                'project.gestion.title': 'Application de Gestion',
                'project.gestion.category': 'Logiciel Desktop .NET / C#',
                'project.csv.title': 'Visualisation CSV',
                'project.csv.category': 'Visualisation de données; JavaScript / Chart.js',
                'project.iss.title': 'Suivi de l\'ISS',
                'project.iss.category': 'Web Application ; JavaScript / Leaflet',
                'project.chatbot.title': 'Chatbot Openbiz Dev',
                'project.chatbot.category': 'Assistant virtuel ; JavaScript vanilla',
                'project.next.title': 'Prochain Projet',
                'project.next.category': 'En cours de réalisation',
                'project.soon': 'Bientôt disponible',
                
                // BTS Section
                'bts.label': 'FORMATION',
                'bts.title': 'BTS SIO',
                'bts.subtitle': 'Services Informatiques aux Organisations',
                'bts.description': 'Le BTS Services Informatiques aux Organisations est une formation en deux ans qui prépare aux métiers de l\'informatique. Il propose deux spécialités distinctes adaptées aux différents profils et aspirations professionnelles. Cette formation diplômante de niveau Bac+2 permet d\'acquérir des compétences techniques solides dans le domaine de l\'informatique, tout en développant des compétences transversales en communication, gestion de projet et travail en équipe.',
                'bts.discoverOptions': '→ Découvrir les options',
                'bts.modalTitle': 'Options du BTS SIO',
                
                // Parcours
                'parcours.title': 'Parcours',
                'parcours.monParcours': 'Mon Parcours',
                'parcours.bts.title': 'BTS services informatiques aux organisations',
                'parcours.bts.description': 'Formation en développement et maintenance des applications, gestion des systèmes et réseaux, assistance et conseil, travail en équipe et gestion de projet.',
                'parcours.bts.task1': 'Développement et maintenance des applications',
                'parcours.bts.task2': 'Gestion des systèmes et réseaux',
                'parcours.bts.task3': 'Assistance et conseil',
                'parcours.bts.task4': 'Travail en équipe et gestion de projet',
                'parcours.active': 'ACTIVE',
                'parcours.informatique': 'Informatique',
                
                // Stages
                'stages.title': 'Stages',
                
                // Veille
                'veille.title': 'Veille Technologique',
                'veille.avions.title': 'Le numérique au service des armées : modernisation et leçons pour un développeur',
                'veille.avions.description': 'Lien entre défense nationale, innovation et pratiques du développement — sources officielles, peu de jargon.',
                'veille.avions.badge': 'Défense',
                'veille.avions.tag1': 'Défense',
                'veille.avions.tag2': 'Cyberdéfense',
                'veille.avions.tag3': 'Innovation',
                'veille.automatisation.title': 'Automatiser son travail de développeur',
                'veille.automatisation.description': 'Moins de gestes répétitifs : enchaîner les tâches avec n8n, GitHub et des notifications entre services.',
                'veille.automatisation.badge': 'Automatisation',
                'veille.automatisation.tag1': 'n8n',
                'veille.automatisation.tag2': 'Tests auto',
                'veille.automatisation.tag3': 'Alertes',
                'veille.meta.recent': 'Mise à jour récente',
                'veille.meta.readingTime': 'min de lecture',
                'veille.stats.subjects': 'Sujets suivis',
                'veille.stats.sources': 'Sources consultées',
                'veille.stats.update': 'Mise à jour',
                'veille.stats.regular': 'Régulière',
                
                // Compétences
                'competences.title': 'Compétences'
            },
            en: {
                // Navigation
                'nav.profil': 'Profile',
                'nav.projets': 'Projects',
                'nav.parcours': 'Career',
                'nav.stages': 'Internships',
                'nav.veille': 'Watch',
                'nav.contact': 'Contact',
                'nav.competences': 'Skills',
                
                // Index - Hero
                'hero.title': 'Hello, Welcome to my',
                'hero.portfolio': 'Portfolio',
                'hero.subtitle': 'I am Ludovic CHAMPROBERT, computer science student.',
                'hero.contact': 'Contact me',
                'hero.cv': 'My CV',
                'hero.role': 'Computer science student',
                
                // Index - About
                'about.title': 'About me',
                'about.label': 'PROFILE',
                'about.text1': 'Currently training to become an application developer, I am passionate about creating innovative digital solutions. My unique background, combining military experience at the 40th Signal Regiment and a career change into development, has allowed me to develop a strong work ethic and problem-solving skills.',
                'about.text2': 'My passion for programming is expressed through various projects, particularly in PHP/Symfony and web development. I am particularly interested in cybersecurity and secure application development.',
                
                // Index - Projects
                'projects.title': 'My Projects',
                'projects.subtitle': 'Discover my recent achievements and ongoing projects.',
                'projects.scroll': 'Scroll to explore',
                
                // Index - Stats
                'stats.title': 'In Numbers',
                
                // Index - Skills
                'skills.title': 'My Skills',
                'skills.subtitle': 'Scroll to explore my technical expertise',
                'skills.frontend.title': 'Frontend',
                'skills.frontend.description': 'Creating dynamic, responsive and accessible user interfaces with modern web standards.',
                'skills.backend.title': 'Backend',
                'skills.backend.description': 'Developing robust server architectures, RESTful APIs and optimized databases.',
                'skills.software.title': 'Software',
                'skills.software.description': 'Designing complex algorithms and developing object-oriented software applications.',
                'skills.devops.title': 'DevOps',
                'skills.devops.description': 'Automating deployments, containerization and version management for agile teams.',
                'skills.cms.title': 'CMS',
                'skills.cms.description': 'Deploying and customizing content management systems for showcase and e-commerce sites.',
                'skills.certs.title': 'Certifications',
                'skills.certs.description': 'Technical skills validated by recognized training organizations.',
                
                // Common
                'common.seeMore': 'See more',
                'common.seeLess': 'See less',
                'common.viewProject': 'View project',
                'common.viewReport': 'View internship report',
                
                // Index - Certifications
                'certifications.title': 'My Certifications',
                
                // Projets page
                'projets.scroll': 'SCROLLER POUR EXPLORER ->',
                
                // Contact page
                'contact.title': 'Contact.',
                'contact.description': 'I would be delighted to hear from you. Send me a message and let\'s start the conversation.',
                'contact.quote': 'From military rigor to code creativity, my atypical background is my greatest strength. It allows me to approach software development with discipline, precision and innovation.',
                'contact.author': 'Ludovic CHAMPROBERT',
                'contact.role': 'BTS SIO Developer',
                'contact.form.name': 'Name',
                'contact.form.name.placeholder': 'Enter your name',
                'contact.form.email': 'Email',
                'contact.form.email.placeholder': 'Enter your email',
                'contact.form.message': 'Message',
                'contact.form.message.placeholder': 'Write your message',
                'contact.form.submit': 'Send',
                'contact.form.sending': 'Sending...',
                'contact.success': 'Message sent successfully! I will reply as soon as possible.',
                
                // Footer
                'footer.copyright': '© 2025 Ludovic CHAMPROBERT',
                'footer.credits': 'Site developed with the assistance of GitHub Copilot',
                'footer.privacy': 'Privacy Policy',
                'footer.cookies': 'Cookie Policy',
                'footer.legal': 'Legal Notice',
                'footer.backToTop': 'Back to top',
                
                // Projets détaillés
                'project.ecommerce.title': 'E-commerce Site',
                'project.ecommerce.category': 'Fullstack Development; Symfony',
                'project.gestion.title': 'Management Application',
                'project.gestion.category': 'Desktop Software .NET / C#',
                'project.csv.title': 'CSV Visualization',
                'project.csv.category': 'Data Visualization; JavaScript / Chart.js',
                'project.iss.title': 'ISS Tracking',
                'project.iss.category': 'Web Application ; JavaScript / Leaflet',
                'project.chatbot.title': 'Openbiz Dev Chatbot',
                'project.chatbot.category': 'Virtual Assistant ; Vanilla JavaScript',
                'project.next.title': 'Next Project',
                'project.next.category': 'In progress',
                'project.soon': 'Coming soon',
                
                // BTS Section
                'bts.label': 'TRAINING',
                'bts.title': 'BTS SIO',
                'bts.subtitle': 'IT Services for Organizations',
                'bts.description': 'The BTS IT Services for Organizations is a two-year training program that prepares for IT careers. It offers two distinct specializations adapted to different profiles and professional aspirations. This level Bac+2 diploma program allows you to acquire solid technical skills in IT, while developing transversal skills in communication, project management and teamwork.',
                'bts.discoverOptions': '→ Discover the options',
                'bts.modalTitle': 'BTS SIO Options',
                
                // Parcours
                'parcours.title': 'Career',
                'parcours.monParcours': 'My Career',
                'parcours.bts.title': 'BTS IT Services for Organizations',
                'parcours.bts.description': 'Training in application development and maintenance, systems and network management, support and consulting, teamwork and project management.',
                'parcours.bts.task1': 'Application development and maintenance',
                'parcours.bts.task2': 'Systems and network management',
                'parcours.bts.task3': 'Support and consulting',
                'parcours.bts.task4': 'Teamwork and project management',
                'parcours.active': 'ACTIVE',
                'parcours.informatique': 'IT',
                
                // Stages
                'stages.title': 'Internships',
                
                // Veille
                'veille.title': 'Technology Watch',
                'veille.avions.title': 'Digital technology in the armed forces: modernization and lessons for developers',
                'veille.avions.description': 'National defence, innovation and software practices — official sources, plain language.',
                'veille.avions.badge': 'Defence',
                'veille.avions.tag1': 'Defence',
                'veille.avions.tag2': 'Cyber defence',
                'veille.avions.tag3': 'Innovation',
                'veille.automatisation.title': 'Automating a developer\'s everyday work',
                'veille.automatisation.description': 'Fewer repetitive steps: chaining tasks with n8n, GitHub and notifications between services.',
                'veille.automatisation.badge': 'Automation',
                'veille.automatisation.tag1': 'n8n',
                'veille.automatisation.tag2': 'Auto tests',
                'veille.automatisation.tag3': 'Alerts',
                'veille.meta.recent': 'Recent update',
                'veille.meta.readingTime': 'min read',
                'veille.stats.subjects': 'Topics followed',
                'veille.stats.sources': 'Sources consulted',
                'veille.stats.update': 'Update',
                'veille.stats.regular': 'Regular',
                
                // Compétences
                'competences.title': 'Skills'
            }
        };
    }

    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'fr' ? 'active' : ''}" data-lang="fr">
                <span>FR</span>
            </button>
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                <span>EN</span>
            </button>
        `;

        switcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.switchLanguage(lang);
            });
        });

        // Ajouter dans la navbar ou ailleurs
        const navbar = document.querySelector('.nav-inner');
        if (navbar) {
            navbar.appendChild(switcher);
        } else {
            document.body.insertBefore(switcher, document.body.firstChild);
        }
    }

    createFooterLanguageSwitcher() {
        // Vérifier si le sélecteur footer existe déjà
        let footerSwitcher = document.querySelector('.footer-language-switcher');
        if (!footerSwitcher) {
            // Créer le sélecteur si il n'existe pas
            footerSwitcher = document.createElement('div');
            footerSwitcher.className = 'footer-language-switcher';
            footerSwitcher.innerHTML = `
                <span class="lang-option ${this.currentLang === 'fr' ? 'active' : ''}" data-lang="fr">FR</span>
                <span class="lang-separator">|</span>
                <span class="lang-option ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
            `;

            // Ajouter les event listeners
            footerSwitcher.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', () => {
                    const lang = option.dataset.lang;
                    this.switchLanguage(lang);
                });
            });

            // Trouver le footer-center ou le créer
            let footerCenter = document.querySelector('.footer-center');
            if (!footerCenter) {
                footerCenter = document.createElement('div');
                footerCenter.className = 'footer-center';
                const footerContainer = document.querySelector('.footer-container');
                if (footerContainer) {
                    footerContainer.appendChild(footerCenter);
                }
            }
            footerCenter.appendChild(footerSwitcher);
        } else {
            // Mettre à jour les classes actives si le sélecteur existe déjà
            footerSwitcher.querySelectorAll('.lang-option').forEach(option => {
                option.classList.toggle('active', option.dataset.lang === this.currentLang);
            });
        }
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.applyLanguage(lang);
        
        // Mettre à jour les boutons actifs (navbar)
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Mettre à jour les options actives (footer)
        document.querySelectorAll('.footer-language-switcher .lang-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
    }

    applyLanguage(lang) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'multilingual.js:327',message:'applyLanguage called',data:{lang:lang,currentUrl:window.location.href},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        
        // Appliquer les traductions aux éléments avec data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'multilingual.js:330',message:'Found elements to translate',data:{count:elements.length,lang:lang},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const oldText = element.textContent;
            if (this.translations[lang] && this.translations[lang][key]) {
                // Pour les éléments input/textarea, mettre à jour le placeholder si présent
                if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.hasAttribute('data-i18n-placeholder')) {
                    const placeholderKey = element.getAttribute('data-i18n-placeholder');
                    if (this.translations[lang][placeholderKey]) {
                        element.placeholder = this.translations[lang][placeholderKey];
                    }
                } else {
                    const newText = this.translations[lang][key];
                    // #region agent log
                    if (oldText !== newText) {
                        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'multilingual.js:342',message:'Changing text content',data:{key:key,oldText:oldText.substring(0,50),newText:newText.substring(0,50),elementTag:element.tagName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
                    }
                    // #endregion
                    element.textContent = newText;
                }
            }
        });

        // Gérer les placeholders séparément
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.translations[lang] && this.translations[lang][key]) {
                element.placeholder = this.translations[lang][key];
            }
        });

        // Mettre à jour l'attribut lang du HTML
        document.documentElement.lang = lang;

        // Déclencher un événement personnalisé
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    t(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }
}

// Instance globale
const i18n = new Multilingual();

document.addEventListener('DOMContentLoaded', () => {
    // Les traductions seront appliquées automatiquement
});


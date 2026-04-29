// Search Functionality
class Search {
    constructor() {
        this.searchIndex = [];
        this.searchInput = null;
        this.resultsContainer = null;
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.createSearchUI();
        this.setupEventListeners();
    }

    buildSearchIndex() {
        // Indexer tout le contenu de la page
        const contentElements = document.querySelectorAll('h1, h2, h3, h4, p, li, .project-card, .skill-card-new');
        
        contentElements.forEach(element => {
            const text = element.textContent.trim();
            if (text.length > 10) { // Ignorer les textes trop courts
                this.searchIndex.push({
                    text: text,
                    element: element,
                    url: this.getPageUrl(element),
                    type: this.getElementType(element)
                });
            }
        });
    }

    getPageUrl(element) {
        // Retourner l'URL de la page actuelle ou un lien associé
        const link = element.closest('a');
        if (link && link.href) {
            return link.href;
        }
        return window.location.href;
    }

    getElementType(element) {
        if (element.matches('h1, h2, h3')) return 'heading';
        if (element.matches('.project-card')) return 'project';
        if (element.matches('.skill-card-new')) return 'skill';
        return 'content';
    }

    createSearchUI() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-wrapper">
                <input 
                    type="search" 
                    id="global-search" 
                    class="search-input" 
                    placeholder="Rechercher..."
                    aria-label="Rechercher sur le site"
                >
                <button class="search-button" aria-label="Rechercher">
                    <i class="fas fa-search"></i>
                </button>
                <div class="search-results" id="search-results"></div>
            </div>
        `;

        // Ajouter dans la navbar
        const navbar = document.querySelector('.nav-inner');
        if (navbar) {
            navbar.insertBefore(searchContainer, navbar.querySelector('.nav-menu'));
        }

        this.searchInput = searchContainer.querySelector('#global-search');
        this.resultsContainer = searchContainer.querySelector('#search-results');
    }

    setupEventListeners() {
        if (!this.searchInput) return;

        let searchTimeout;
        
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length < 2) {
                this.hideResults();
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim().length >= 2) {
                this.performSearch(this.searchInput.value.trim());
            }
        });

        // Fermer les résultats en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });

        // Navigation au clavier
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideResults();
                this.searchInput.blur();
            }
        });
    }

    performSearch(query) {
        const results = this.searchIndex.filter(item => {
            const searchText = item.text.toLowerCase();
            const searchQuery = query.toLowerCase();
            return searchText.includes(searchQuery);
        }).slice(0, 10); // Limiter à 10 résultats

        this.displayResults(results, query);
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="search-result-item no-results">
                    <p>Aucun résultat trouvé pour "${query}"</p>
                </div>
            `;
            this.showResults();
            return;
        }

        this.resultsContainer.innerHTML = results.map(result => {
            const highlightedText = this.highlightText(result.text, query);
            return `
                <a href="${result.url}" class="search-result-item">
                    <div class="search-result-type">${this.getTypeLabel(result.type)}</div>
                    <div class="search-result-text">${highlightedText}</div>
                </a>
            `;
        }).join('');

        this.showResults();
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    getTypeLabel(type) {
        const labels = {
            'heading': 'Titre',
            'project': 'Projet',
            'skill': 'Compétence',
            'content': 'Contenu'
        };
        return labels[type] || 'Résultat';
    }

    showResults() {
        this.resultsContainer.classList.add('show');
    }

    hideResults() {
        this.resultsContainer.classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Search();
});


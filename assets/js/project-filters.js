// Project Filters System
class ProjectFilters {
    constructor() {
        this.projects = [];
        this.filters = {
            technology: [],
            type: [],
            status: []
        };
        this.activeFilters = {
            technology: [],
            type: [],
            status: []
        };
        this.init();
    }

    init() {
        this.container = document.querySelector('.projects-grid');
        if (!this.container) return;

        this.extractProjects();
        this.createFilterUI();
        this.setupEventListeners();
    }

    extractProjects() {
        const projectCards = this.container.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.trim());
            const projectData = {
                element: card,
                index: index,
                technologies: techTags,
                title: card.querySelector('h3')?.textContent || '',
                type: card.dataset.type || 'web',
                status: card.dataset.status || 'completed'
            };
            this.projects.push(projectData);

            // Extract unique technologies
            techTags.forEach(tech => {
                if (!this.filters.technology.includes(tech)) {
                    this.filters.technology.push(tech);
                }
            });
        });
    }

    createFilterUI() {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'project-filters';
        filtersContainer.innerHTML = `
            <div class="filters-header">
                <h3>Filtrer par technologie</h3>
                <button class="clear-filters" aria-label="Effacer les filtres">Effacer</button>
            </div>
            <div class="filter-tags">
                ${this.filters.technology.map(tech => `
                    <button class="filter-tag" data-filter="technology" data-value="${tech}">
                        ${tech}
                    </button>
                `).join('')}
            </div>
        `;

        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.insertAdjacentElement('afterend', filtersContainer);
        } else {
            this.container.parentElement.insertBefore(filtersContainer, this.container);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.filter-tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = btn.dataset.filter;
                const filterValue = btn.dataset.value;
                this.toggleFilter(filterType, filterValue);
                btn.classList.toggle('active');
            });
        });

        const clearBtn = document.querySelector('.clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    toggleFilter(type, value) {
        const index = this.activeFilters[type].indexOf(value);
        if (index > -1) {
            this.activeFilters[type].splice(index, 1);
        } else {
            this.activeFilters[type].push(value);
        }
        this.applyFilters();
    }

    clearAllFilters() {
        this.activeFilters = {
            technology: [],
            type: [],
            status: []
        };
        document.querySelectorAll('.filter-tag').forEach(btn => {
            btn.classList.remove('active');
        });
        this.applyFilters();
    }

    applyFilters() {
        let visibleCount = 0;

        this.projects.forEach(project => {
            let show = true;

            // Technology filter
            if (this.activeFilters.technology.length > 0) {
                const hasMatchingTech = this.activeFilters.technology.some(tech =>
                    project.technologies.includes(tech)
                );
                if (!hasMatchingTech) show = false;
            }

            // Type filter
            if (this.activeFilters.type.length > 0) {
                if (!this.activeFilters.type.includes(project.type)) {
                    show = false;
                }
            }

            // Status filter
            if (this.activeFilters.status.length > 0) {
                if (!this.activeFilters.status.includes(project.status)) {
                    show = false;
                }
            }

            if (show) {
                project.element.style.display = '';
                project.element.classList.add('filtered-visible');
                visibleCount++;
            } else {
                project.element.style.display = 'none';
                project.element.classList.remove('filtered-visible');
            }
        });

        // Show "no results" message if needed
        this.showNoResults(visibleCount === 0);
    }

    showNoResults(show) {
        let noResults = document.querySelector('.no-results-message');
        if (show && !noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results-message';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <p>Aucun projet ne correspond aux filtres sélectionnés.</p>
            `;
            this.container.parentElement.insertBefore(noResults, this.container.nextSibling);
        } else if (!show && noResults) {
            noResults.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.projects-grid')) {
        new ProjectFilters();
    }
});


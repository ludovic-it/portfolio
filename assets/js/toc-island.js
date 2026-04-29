// TOC Island with progress indicator
class TOCIsland {
    constructor() {
        this.tocContainer = null;
        this.sections = [];
        this.progress = 0;
        this.init();
    }

    init() {
        this.createTOC();
        this.findSections();
        this.setupScrollListener();
    }

    createTOC() {
        // Check if TOC already exists
        const existingTOC = document.querySelector('.toc-island');
        if (existingTOC) {
            this.tocContainer = existingTOC;
            return;
        }

        // Find project header to insert TOC after
        const projectHeader = document.querySelector('.project-header');
        if (!projectHeader) return;

        // Create TOC container
        this.tocContainer = document.createElement('div');
        this.tocContainer.className = 'toc-island sticky-toc';
        this.tocContainer.innerHTML = `
            <div class="toc-header">
                <span class="toc-title">Progression</span>
                <div class="toc-progress-circle">
                    <svg class="toc-progress-svg" viewBox="0 0 36 36">
                        <path class="toc-progress-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <path class="toc-progress-bar" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    </svg>
                    <span class="toc-progress-text">0%</span>
                </div>
            </div>
            <div class="toc-dropdown">
                <ul class="toc-list"></ul>
            </div>
        `;
        
        // Insert after project header
        projectHeader.insertAdjacentElement('afterend', this.tocContainer);
        
        // Setup toggle
        const tocHeader = this.tocContainer.querySelector('.toc-header');
        if (tocHeader) {
            tocHeader.addEventListener('click', () => {
                this.tocContainer.classList.toggle('open');
            });
        }
    }

    findSections() {
        const headings = document.querySelectorAll('.project-main h2, .project-main h3');
        
        if (headings.length === 0) {
            // Hide TOC if no sections found
            if (this.tocContainer) {
                this.tocContainer.style.display = 'none';
            }
            return;
        }

        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `section-${index}`;
            }
            this.sections.push({
                id: heading.id,
                text: heading.textContent,
                element: heading,
                level: heading.tagName.toLowerCase()
            });

            // Add to TOC list
            const tocList = this.tocContainer.querySelector('.toc-list');
            const li = document.createElement('li');
            li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close dropdown after click
                this.tocContainer.classList.remove('open');
            });
            li.appendChild(a);
            tocList.appendChild(li);
        });
    }

    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateProgress();
                    this.updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial update
        this.updateProgress();
    }

    updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollableHeight = documentHeight - windowHeight;
        
        this.progress = scrollableHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollableHeight) * 100)) : 0;
        
        const progressText = this.tocContainer.querySelector('.toc-progress-text');
        const progressBar = this.tocContainer.querySelector('.toc-progress-bar');
        
        if (progressText) {
            progressText.textContent = `${this.progress}%`;
        }

        if (progressBar) {
            const radius = 15.9155;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (this.progress / 100) * circumference;
            progressBar.style.strokeDasharray = `${circumference}`;
            progressBar.style.strokeDashoffset = offset;
        }
    }

    updateActiveSection() {
        const tocItems = this.tocContainer.querySelectorAll('.toc-item');
        const scrollPosition = window.pageYOffset + 200;

        this.sections.forEach((section, index) => {
            const sectionTop = section.element.offsetTop;
            const sectionBottom = sectionTop + section.element.offsetHeight;
            const tocItem = tocItems[index];

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                tocItems.forEach(item => item.classList.remove('active'));
                if (tocItem) {
                    tocItem.classList.add('active');
                }
            }
        });
    }
}

// Initialize TOC Island
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.project-detail')) {
        new TOCIsland();
    }
});


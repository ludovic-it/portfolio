// GitHub API Integration
class GitHubAPI {
    constructor(username) {
        this.username = username || 'Ludovic-SIO';
        this.apiUrl = 'https://api.github.com';
        this.repos = [];
        this.init();
    }

    async init() {
        await this.fetchRepositories();
        this.renderRepositories();
    }

    async fetchRepositories() {
        try {
            const response = await fetch(`${this.apiUrl}/users/${this.username}/repos?sort=updated&per_page=6`);
            if (!response.ok) throw new Error('Failed to fetch repositories');
            
            const data = await response.json();
            this.repos = data.filter(repo => !repo.fork && repo.description).slice(0, 6);
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            this.repos = [];
        }
    }

    renderRepositories() {
        const container = document.getElementById('github-repos');
        if (!container || this.repos.length === 0) return;

        container.innerHTML = this.repos.map(repo => `
            <div class="github-repo-card reveal">
                <div class="repo-header">
                    <h3>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                            ${repo.name}
                        </a>
                    </h3>
                    <span class="repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
                </div>
                <p class="repo-description">${repo.description || 'No description'}</p>
                <div class="repo-meta">
                    <span class="repo-language">
                        <span class="language-dot" style="background-color: ${this.getLanguageColor(repo.language)}"></span>
                        ${repo.language || 'N/A'}
                    </span>
                    <span class="repo-stars">
                        <i class="fas fa-star"></i> ${repo.stargazers_count}
                    </span>
                    <span class="repo-forks">
                        <i class="fas fa-code-branch"></i> ${repo.forks_count}
                    </span>
                    <span class="repo-updated">
                        Updated ${this.formatDate(repo.updated_at)}
                    </span>
                </div>
                ${repo.topics.length > 0 ? `
                    <div class="repo-topics">
                        ${repo.topics.slice(0, 3).map(topic => `
                            <span class="repo-topic">${topic}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');

        // Ajouter le CSS si nécessaire
        this.injectStyles();
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'PHP': '#4F5D95',
            'Java': '#b07219',
            'CSS': '#563d7c',
            'HTML': '#e34c26',
            'Vue': '#41b883',
            'React': '#61dafb',
            'Symfony': '#000000'
        };
        return colors[language] || '#586069';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    injectStyles() {
        if (document.getElementById('github-api-styles')) return;

        const style = document.createElement('style');
        style.id = 'github-api-styles';
        style.textContent = `
            .github-repo-card {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                border: 1px solid var(--border-color, #e5e5e5);
                transition: all 0.3s ease;
            }
            .github-repo-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .repo-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            .repo-header h3 {
                margin: 0;
                font-size: 1.1rem;
            }
            .repo-header a {
                color: var(--primary-color, #4A7FFF);
                text-decoration: none;
            }
            .repo-description {
                color: var(--text-secondary, #666666);
                margin: 0.75rem 0;
                line-height: 1.5;
            }
            .repo-meta {
                display: flex;
                gap: 1rem;
                font-size: 0.85rem;
                color: var(--text-light, #999999);
                flex-wrap: wrap;
            }
            .repo-language {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .language-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
            }
            .repo-topics {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                margin-top: 1rem;
            }
            .repo-topic {
                padding: 4px 8px;
                background: rgba(74, 127, 255, 0.1);
                color: var(--primary-color, #4A7FFF);
                border-radius: 12px;
                font-size: 0.75rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('github-repos')) {
        new GitHubAPI();
    }
});


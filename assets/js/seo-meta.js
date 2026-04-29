// SEO Meta Tags Helper
class SEOMeta {
    static addMetaTags(pageData) {
        const head = document.head;
        
        // Remove existing meta tags if any
        const existingOG = head.querySelectorAll('meta[property^="og:"]');
        const existingTwitter = head.querySelectorAll('meta[name^="twitter:"]');
        [...existingOG, ...existingTwitter].forEach(tag => tag.remove());

        // Meta Description
        if (pageData.description) {
            let metaDesc = head.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', pageData.description);
        }

        // Open Graph Tags
        const ogTags = {
            'og:title': pageData.title || document.title,
            'og:description': pageData.description || '',
            'og:type': pageData.type || 'website',
            'og:url': pageData.url || window.location.href,
            'og:image': pageData.image || `${window.location.origin}/assets/images/og-image.jpg`,
            'og:site_name': 'Ludovic.C - Portfolio BTS SIO SLAM',
            'og:locale': 'fr_FR'
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            if (content) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', property);
                meta.setAttribute('content', content);
                head.appendChild(meta);
            }
        });

        // Twitter Card Tags
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': pageData.title || document.title,
            'twitter:description': pageData.description || '',
            'twitter:image': pageData.image || `${window.location.origin}/assets/images/twitter-image.jpg`
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            if (content) {
                const meta = document.createElement('meta');
                meta.setAttribute('name', name);
                meta.setAttribute('content', content);
                head.appendChild(meta);
            }
        });

        // Schema.org Structured Data
        if (pageData.schema) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(pageData.schema);
            head.appendChild(script);
        }
    }
}


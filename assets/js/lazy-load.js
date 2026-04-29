// Lazy Loading for Images and Videos
class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        try {
            if ('IntersectionObserver' in window && window.IntersectionObserver) {
                this.setupImageObserver();
                this.setupVideoObserver();
                this.setupIframeObserver();
            } else {
                // Fallback: load all immediately
                this.loadAll();
            }
        } catch (e) {
            console.warn('Erreur lors de l\'initialisation de LazyLoader:', e);
            // Fallback: charger tout immédiatement
            this.loadAll();
        }
    }

    setupImageObserver() {
        try {
            if (!window.IntersectionObserver) {
                this.loadAll();
                return;
            }

            const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
            if (!images || images.length === 0) return;
            
            const imageObserver = new IntersectionObserver((entries) => {
                try {
                    entries.forEach(entry => {
                        if (entry && entry.isIntersecting && entry.target) {
                            const img = entry.target;
                            this.loadImage(img);
                            if (imageObserver && imageObserver.unobserve) {
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                } catch (e) {
                    console.warn('Erreur dans l\'observer d\'images:', e);
                }
            }, {
                rootMargin: '50px'
            });

            images.forEach(img => {
                if (img && img.hasAttribute && img.hasAttribute('data-src')) {
                    if (imageObserver && imageObserver.observe) {
                        imageObserver.observe(img);
                    }
                }
            });
        } catch (e) {
            console.warn('Erreur lors de la configuration de l\'observer d\'images:', e);
            this.loadAll();
        }
    }

    setupVideoObserver() {
        try {
            if (!window.IntersectionObserver) {
                this.loadAll();
                return;
            }

            const videos = document.querySelectorAll('video[data-src]');
            if (!videos || videos.length === 0) return;
            
            const videoObserver = new IntersectionObserver((entries) => {
                try {
                    entries.forEach(entry => {
                        if (entry && entry.isIntersecting && entry.target) {
                            const video = entry.target;
                            this.loadVideo(video);
                            if (videoObserver && videoObserver.unobserve) {
                                videoObserver.unobserve(video);
                            }
                        }
                    });
                } catch (e) {
                    console.warn('Erreur dans l\'observer de vidéos:', e);
                }
            }, {
                rootMargin: '100px'
            });

            videos.forEach(video => {
                if (video && videoObserver && videoObserver.observe) {
                    videoObserver.observe(video);
                }
            });
        } catch (e) {
            console.warn('Erreur lors de la configuration de l\'observer de vidéos:', e);
            this.loadAll();
        }
    }

    setupIframeObserver() {
        try {
            if (!window.IntersectionObserver) {
                this.loadAll();
                return;
            }

            const iframes = document.querySelectorAll('iframe[data-src]');
            if (!iframes || iframes.length === 0) return;
            
            const iframeObserver = new IntersectionObserver((entries) => {
                try {
                    entries.forEach(entry => {
                        if (entry && entry.isIntersecting && entry.target) {
                            const iframe = entry.target;
                            this.loadIframe(iframe);
                            if (iframeObserver && iframeObserver.unobserve) {
                                iframeObserver.unobserve(iframe);
                            }
                        }
                    });
                } catch (e) {
                    console.warn('Erreur dans l\'observer d\'iframes:', e);
                }
            }, {
                rootMargin: '100px'
            });

            iframes.forEach(iframe => {
                if (iframe && iframeObserver && iframeObserver.observe) {
                    iframeObserver.observe(iframe);
                }
            });
        } catch (e) {
            console.warn('Erreur lors de la configuration de l\'observer d\'iframes:', e);
            this.loadAll();
        }
    }

    loadImage(img) {
        try {
            if (!img) return;
            const src = (img.dataset && img.dataset.src) || img.getAttribute('data-src');
            if (src) {
                img.src = src;
                if (img.removeAttribute) {
                    img.removeAttribute('data-src');
                }
                
                if (img.addEventListener) {
                    img.addEventListener('load', () => {
                        if (img && img.classList && img.classList.add) {
                            img.classList.add('loaded');
                        }
                    });

                    img.addEventListener('error', () => {
                        if (img && img.classList && img.classList.add) {
                            img.classList.add('error');
                        }
                        if (img && img.setAttribute) {
                            img.setAttribute('alt', 'Image non disponible');
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('Erreur lors du chargement de l\'image:', e);
        }
    }

    loadVideo(video) {
        try {
            if (!video) return;
            const src = (video.dataset && video.dataset.src) || video.getAttribute('data-src');
            if (src) {
                video.src = src;
                if (video.removeAttribute) {
                    video.removeAttribute('data-src');
                }
                if (video.load && typeof video.load === 'function') {
                    video.load();
                }
            }
        } catch (e) {
            console.warn('Erreur lors du chargement de la vidéo:', e);
        }
    }

    loadIframe(iframe) {
        try {
            if (!iframe) return;
            const src = (iframe.dataset && iframe.dataset.src) || iframe.getAttribute('data-src');
            if (src) {
                iframe.src = src;
                if (iframe.removeAttribute) {
                    iframe.removeAttribute('data-src');
                }
            }
        } catch (e) {
            console.warn('Erreur lors du chargement de l\'iframe:', e);
        }
    }

    loadAll() {
        try {
            const images = document.querySelectorAll('img[data-src]');
            if (images && images.forEach) {
                images.forEach(img => this.loadImage(img));
            }

            const videos = document.querySelectorAll('video[data-src]');
            if (videos && videos.forEach) {
                videos.forEach(video => this.loadVideo(video));
            }

            const iframes = document.querySelectorAll('iframe[data-src]');
            if (iframes && iframes.forEach) {
                iframes.forEach(iframe => this.loadIframe(iframe));
            }
        } catch (e) {
            console.warn('Erreur lors du chargement de tous les éléments:', e);
        }
    }
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            new LazyLoader();
        } catch (e) {
            console.warn('Erreur lors de l\'initialisation de LazyLoader:', e);
        }
    });
} else {
    try {
        new LazyLoader();
    } catch (e) {
        console.warn('Erreur lors de l\'initialisation de LazyLoader:', e);
    }
}


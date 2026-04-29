/**
 * Browser Compatibility Detection
 * Détecte le support des fonctionnalités modernes et fournit des fallbacks
 */

(function() {
    'use strict';

    const BrowserCompat = {
        features: {},
        warnings: [],

        init: function() {
            this.detectFeatures();
            this.createPolyfills();
            this.logWarnings();
            this.applyFallbacks();
        },

        detectFeatures: function() {
            // IntersectionObserver
            this.features.IntersectionObserver = 'IntersectionObserver' in window;

            // requestAnimationFrame
            this.features.requestAnimationFrame = 'requestAnimationFrame' in window;

            // classList
            this.features.classList = 'classList' in document.createElement('div');

            // dataset
            this.features.dataset = 'dataset' in document.createElement('div');

            // Canvas
            this.features.canvas = (function() {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext && canvas.getContext('2d'));
                } catch (e) {
                    return false;
                }
            })();

            // WebGL
            this.features.webgl = (function() {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                } catch (e) {
                    return false;
                }
            })();

            // CSS Variables
            this.features.cssVariables = (function() {
                try {
                    return CSS.supports('color', 'var(--fake-var)');
                } catch (e) {
                    return false;
                }
            })();

            // backdrop-filter
            this.features.backdropFilter = (function() {
                return CSS.supports('backdrop-filter', 'blur(10px)') || 
                       CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
            })();

            // transform3d
            this.features.transform3d = (function() {
                return CSS.supports('transform', 'translate3d(0,0,0)');
            })();

            // Flexbox
            this.features.flexbox = (function() {
                return CSS.supports('display', 'flex');
            })();

            // Grid
            this.features.grid = (function() {
                return CSS.supports('display', 'grid');
            })();

            // Fetch API
            this.features.fetch = 'fetch' in window;

            // Promise
            this.features.promise = 'Promise' in window;

            // localStorage
            this.features.localStorage = (function() {
                try {
                    const test = '__localStorage_test__';
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch (e) {
                    return false;
                }
            })();
        },

        createPolyfills: function() {
            // Polyfill pour requestAnimationFrame
            if (!this.features.requestAnimationFrame) {
                window.requestAnimationFrame = function(callback) {
                    return setTimeout(callback, 1000 / 60);
                };
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
                this.warnings.push('requestAnimationFrame non supporté, utilisation du polyfill');
            }

            // Polyfill basique pour IntersectionObserver
            if (!this.features.IntersectionObserver) {
                window.IntersectionObserver = function(callback, options) {
                    this.callback = callback;
                    this.options = options || {};
                    this.elements = [];

                    this.observe = function(element) {
                        this.elements.push(element);
                        // Fallback : observer immédiatement
                        setTimeout(() => {
                            if (this.callback) {
                                this.callback([{
                                    target: element,
                                    isIntersecting: true,
                                    intersectionRatio: 1
                                }]);
                            }
                        }, 100);
                    };

                    this.unobserve = function(element) {
                        const index = this.elements.indexOf(element);
                        if (index > -1) {
                            this.elements.splice(index, 1);
                        }
                    };

                    this.disconnect = function() {
                        this.elements = [];
                    };
                };
                this.warnings.push('IntersectionObserver non supporté, utilisation du polyfill basique');
            }

            // Vérifier que classList est utilisable
            if (!this.features.classList) {
                this.warnings.push('classList non supporté, certaines fonctionnalités peuvent ne pas fonctionner');
            }

            // Vérifier que dataset est utilisable
            if (!this.features.dataset) {
                this.warnings.push('dataset non supporté, certaines fonctionnalités peuvent ne pas fonctionner');
            }
        },

        applyFallbacks: function() {
            // Ajouter une classe au body pour indiquer les fonctionnalités manquantes
            if (!this.features.backdropFilter) {
                document.documentElement.classList.add('no-backdrop-filter');
            }
            if (!this.features.cssVariables) {
                document.documentElement.classList.add('no-css-variables');
            }
            if (!this.features.transform3d) {
                document.documentElement.classList.add('no-transform3d');
            }
            if (!this.features.flexbox) {
                document.documentElement.classList.add('no-flexbox');
            }
            if (!this.features.grid) {
                document.documentElement.classList.add('no-grid');
            }
            if (!this.features.canvas) {
                document.documentElement.classList.add('no-canvas');
            }
        },

        logWarnings: function() {
            if (this.warnings.length > 0 && console && console.warn) {
                console.group('⚠️ Compatibilité navigateur');
                this.warnings.forEach(warning => {
                    console.warn(warning);
                });
                console.groupEnd();
            }

            // Logger les fonctionnalités non supportées pour debug
            if (console && console.log) {
                const unsupported = Object.keys(this.features).filter(key => !this.features[key]);
                if (unsupported.length > 0) {
                    console.log('Fonctionnalités non supportées:', unsupported.join(', '));
                }
            }
        },

        // Méthode publique pour vérifier une fonctionnalité
        supports: function(feature) {
            return this.features[feature] || false;
        },

        // Méthode publique pour obtenir toutes les fonctionnalités
        getFeatures: function() {
            return Object.assign({}, this.features);
        }
    };

    // Initialiser dès que possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            BrowserCompat.init();
        });
    } else {
        BrowserCompat.init();
    }

    // Exposer globalement pour utilisation dans d'autres scripts
    window.BrowserCompat = BrowserCompat;

})();

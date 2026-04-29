// #region agent log - Debug instrumentation for tech-tag overflow
(function debugTechTagOverflow() {
    const SERVER_ENDPOINT = 'http://127.0.0.1:7248/ingest/b48ec1ae-3675-442f-a25f-5796272ccf44';
    function log(hypothesisId, location, message, data) {
        fetch(SERVER_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                location,
                message,
                data,
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId
            })
        }).catch(() => {});
    }
    
    function measureElement(el, prefix) {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        return {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            overflow: computed.overflow,
            overflowX: computed.overflowX,
            overflowY: computed.overflowY,
            transform: computed.transform,
            scale: computed.transform.includes('scale') ? computed.transform : 'none',
            padding: computed.padding,
            margin: computed.margin
        };
    }
    
    function attachDebugListeners() {
        const categories = document.querySelectorAll('.bts-tech-category');
        if (categories.length === 0) {
            return false;
        }
        
        categories.forEach((category, index) => {
            if (category.dataset.debugAttached) return;
            category.dataset.debugAttached = 'true';
            
            const categoryTitle = category.querySelector('h5')?.textContent || 'Unknown';
            
            category.addEventListener('mouseenter', function() {
                const gridContainer = this.closest('.bts-tech-grid');
                const modalContent = this.closest('.bts-modal-content-new');
                
                log('A', `debug-tech-tag.js:category-${index}:mouseenter`, 'Category hover - scale hypothesis', {
                    categoryIndex: index,
                    categoryTitle,
                    categoryBefore: measureElement(this, 'category'),
                    gridContainer: measureElement(gridContainer, 'grid'),
                    modalContent: measureElement(modalContent, 'modal'),
                    categoryWidth: this.offsetWidth,
                    categoryHeight: this.offsetHeight,
                    categoryScrollWidth: this.scrollWidth,
                    categoryScrollHeight: this.scrollHeight,
                    gridWidth: gridContainer?.offsetWidth,
                    gridScrollWidth: gridContainer?.scrollWidth
                });
                
                setTimeout(() => {
                    const categoryAfter = measureElement(this, 'category');
                    const computed = window.getComputedStyle(this);
                    const rect = this.getBoundingClientRect();
                    const gridRect = gridContainer?.getBoundingClientRect();
                    
                    log('A', `debug-tech-tag.js:category-${index}:hover-state`, 'Category hover state - after transform', {
                        categoryIndex: index,
                        categoryTitle,
                        categoryAfter,
                        transform: computed.transform,
                        boxShadow: computed.boxShadow,
                        zIndex: computed.zIndex,
                        actualWidth: rect.width,
                        actualHeight: rect.height,
                        actualRight: rect.right,
                        actualLeft: rect.left,
                        gridRight: gridRect?.right,
                        gridLeft: gridRect?.left,
                        gridWidth: gridRect?.width,
                        overflowsRight: rect.right > (gridRect?.right || 0),
                        overflowsLeft: rect.left < (gridRect?.left || 0),
                        overflowAmount: rect.right - (gridRect?.right || 0)
                    });
                }, 100);
            });
            
            category.addEventListener('mouseleave', function() {
                log('A', `debug-tech-tag.js:category-${index}:mouseleave`, 'Category hover end', {
                    categoryIndex: index,
                    categoryTitle
                });
            });
        });
        
        log('INIT', 'debug-tech-tag.js:attachDebugListeners', 'Category debug listeners attached', {
            categoryCount: categories.length
        });
        return true;
    }
    
    function initTechTagDebug() {
        attachDebugListeners();
        
        const modal = document.getElementById('bts-modal');
        if (modal) {
            const observer = new MutationObserver(() => {
                if (modal.style.display !== 'none') {
                    setTimeout(() => attachDebugListeners(), 100);
                }
            });
            observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
        }
        
        document.addEventListener('click', function(e) {
            if (e.target.closest('.bts-link-button') || e.target.closest('#open-bts-modal')) {
                setTimeout(() => attachDebugListeners(), 300);
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTechTagDebug);
    } else {
        initTechTagDebug();
    }
})();
// #endregion

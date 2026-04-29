(function () {
    console.log('[Loader] Execution started');

    const MIN_DISPLAY_TIME = 2000;
    const MAX_TIMEOUT = 5000;
    const startTime = Date.now();

    let progress = 0;
    let loader = null;
    let progressInterval = null;

    function updateProgress(value) {
        if (value > progress) {
            progress = value;
            if (loader) {
                loader.style.setProperty('--progress', `${progress}%`);
            }
        }
    }

    function initLoader() {
        loader = document.getElementById('app-loader');
        if (!loader) return false;

        loader.style.opacity = '1';
        loader.style.visibility = 'visible';
        loader.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        updateProgress(15);
        startProgressSimulation();
        return true;
    }

    function startProgressSimulation() {
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (progress < 90) {
                const step = (90 - progress) * 0.05;
                updateProgress(progress + step);
            }
        }, 120);
    }

    function hideLoader() {
        console.log('[Loader] Hiding...');
        clearInterval(progressInterval);
        updateProgress(100);

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

        setTimeout(() => {
            if (!loader) return;
            loader.classList.add('loader-hidden');
            document.body.style.overflow = '';

            setTimeout(() => {
                loader.style.display = 'none';
            }, 850);
        }, remaining);
    }

    // Initialize
    if (!initLoader()) {
        document.addEventListener('DOMContentLoaded', initLoader);
    }

    window.addEventListener('load', hideLoader);

    setTimeout(() => {
        if (loader && !loader.classList.contains('loader-hidden')) {
            hideLoader();
        }
    }, MAX_TIMEOUT);

})();

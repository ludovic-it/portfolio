// Video hover effect - Lance les vidéos au survol
document.addEventListener('DOMContentLoaded', function() {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const video = item.querySelector('.video-player');
        const poster = item.querySelector('.video-poster');
        
        if (!video || !poster) return;
        
        // Capturer la première frame de la vidéo pour l'utiliser comme poster
        const generatePoster = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                
                // Dessiner la première frame sur le canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Convertir en image et l'utiliser comme poster
                const dataUrl = canvas.toDataURL('image/png');
                poster.src = dataUrl;
            }
        };
        
        // S'assurer que la vidéo est à la première frame
        video.currentTime = 0;
        
        // Générer le poster quand la vidéo a assez de données
        const tryGeneratePoster = () => {
            if (video.readyState >= 2 && video.videoWidth > 0) {
                generatePoster();
            }
        };
        
        // Essayer immédiatement si déjà chargé
        tryGeneratePoster();
        
        // Écouter les événements de chargement
        video.addEventListener('loadedmetadata', () => {
            video.currentTime = 0;
        });
        
        video.addEventListener('loadeddata', tryGeneratePoster, { once: true });
        video.addEventListener('seeked', tryGeneratePoster, { once: true });
        
        // Forcer le chargement des métadonnées
        video.load();
        
        // Charger la vidéo au survol
        item.addEventListener('mouseenter', function() {
            video.currentTime = 0;
            video.play().catch(err => {
                console.log('Erreur de lecture vidéo:', err);
            });
        });
        
        // Arrêter la vidéo quand on quitte
        item.addEventListener('mouseleave', function() {
            video.pause();
            video.currentTime = 0;
        });
    });
});


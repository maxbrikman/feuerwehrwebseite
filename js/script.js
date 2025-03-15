(function() {
    const defaultImageRatio = 16 / 9; // Standardseitenverhältnis für Bilder
    const defaultAudioRatio = 32 / 4.5; // Standardseitenverhältnis für Audios
    const defaultVideoRatio = 16 / 9; // Standardseitenverhältnis für Videos

    // Maximalhöhen für jede Medienkategorie
    const maxImageHeight = 4800; // Maximalhöhe für Bilder
    const maxAudioHeight = 337.5; // Maximalhöhe für Audios
    const maxVideoHeight = 4800; // Maximalhöhe für Videos

    const mediaContainers = document.querySelectorAll('.media-container'); // Alle Medien-Container

    // Funktion zur Berechnung und Anwendung des Seitenverhältnisses
    function applyAspectRatioToContainer(mediaContainer, aspectRatio, mediaType) {
        const containerWidth = mediaContainer.offsetWidth; // Container-Breite holen
        const newHeight = containerWidth / aspectRatio; // Neue Höhe basierend auf dem Seitenverhältnis berechnen

        // Anwendung der neuen Dimensionen für jedes Medien-Element im Container
        mediaContainer.querySelectorAll('img, audio, video').forEach(media => {
            media.style.width = `${containerWidth}px`; // Breite an Container-Breite anpassen
            media.style.height = `${newHeight}px`; // Höhe basierend auf Seitenverhältnis anpassen

            // Maximalhöhe für Medien sicherstellen, je nach Typ
            let maxHeight = 0;
            if (media.tagName.toLowerCase() === 'img') {
                maxHeight = maxImageHeight; // Maximalhöhe für Bilder
            } else if (media.tagName.toLowerCase() === 'audio') {
                maxHeight = maxAudioHeight; // Maximalhöhe für Audios
            } else if (media.tagName.toLowerCase() === 'video') {
                maxHeight = maxVideoHeight; // Maximalhöhe für Videos
            }

            // Wenn die berechnete Höhe größer als die Maximalhöhe ist, dann auf Maximalhöhe setzen
            if (newHeight > maxHeight) {
                media.style.height = `${maxHeight}px`;
            }
        });
    }

    // Funktion zur Berechnung des durchschnittlichen Seitenverhältnisses für Medien
    function calculateAverageAspectRatio(mediaElements, defaultRatio) {
        let totalWidth = 0;
        let totalHeight = 0;
        let loadedCount = 0;

        mediaElements.forEach(media => {
            if (media.naturalWidth && media.naturalHeight) {
                totalWidth += media.naturalWidth;
                totalHeight += media.naturalHeight;
                loadedCount++;
            } else if (media.videoWidth && media.videoHeight) {
                totalWidth += media.videoWidth;
                totalHeight += media.videoHeight;
                loadedCount++;
            } else if (media.audioWidth && media.audioHeight) {
                totalWidth += media.audioWidth;
                totalHeight += media.audioHeight;
                loadedCount++;
            } else if (media.imageWidth && media.imageHeight) {
                totalWidth += media.imageWidth;
                totalHeight += media.iamgeHeight;
                loadedCount++;
            } else if (media.offsetWidth && media.offsetHeight) {
                totalWidth += media.offsetWidth;
                totalHeight += media.offsetHeight;
                loadedCount++;
            }
        });

        return loadedCount > 0 ? totalWidth / totalHeight : defaultRatio; // Rückfall auf Standardverhältnis
    }

    // Funktion zur Initialisierung und sofortigen Anwendung der Mediengrößen
    function initializeMedia() {
        mediaContainers.forEach(mediaContainer => {
            // Berechne das Seitenverhältnis für jedes Medien-Element im Container
            const images = mediaContainer.querySelectorAll('img');
            const audios = mediaContainer.querySelectorAll('audio');
            const videos = mediaContainer.querySelectorAll('video');

            const imageAspectRatio = calculateAverageAspectRatio(images, defaultImageRatio);
            const audioAspectRatio = calculateAverageAspectRatio(audios, defaultAudioRatio);
            const videoAspectRatio = calculateAverageAspectRatio(videos, defaultVideoRatio);

            // Wende das Seitenverhältnis für jedes Element im Container an
            applyAspectRatioToContainer(mediaContainer, imageAspectRatio, 'img'); // Für Bilder
            applyAspectRatioToContainer(mediaContainer, audioAspectRatio, 'audio'); // Für Audios
            applyAspectRatioToContainer(mediaContainer, videoAspectRatio, 'video'); // Für Videos

            // Lade Medien sofort, wenn sie das `data-src` Attribut haben
            images.forEach(img => {
                const dataSrc = img.getAttribute('data-src');
                if (dataSrc) {
                    img.setAttribute('src', dataSrc);
                    img.removeAttribute('data-src');
                }
            });

            audios.forEach(audio => {
                const dataSrc = audio.getAttribute('data-src');
                if (dataSrc) {
                    audio.setAttribute('src', dataSrc);
                    audio.removeAttribute('data-src');
                }
            });

            videos.forEach(video => {
                const dataSrc = video.getAttribute('data-src');
                if (dataSrc) {
                    video.setAttribute('src', dataSrc);
                    video.removeAttribute('data-src');
                }
            });
        });
    }

    // Resize-Handler ohne Verzögerung, aber mit sofortiger Anpassung der Mediengrößen
    window.addEventListener('resize', () => {
        mediaContainers.forEach(mediaContainer => {
            // Berechne das Seitenverhältnis und wende es an
            const images = mediaContainer.querySelectorAll('img');
            const audios = mediaContainer.querySelectorAll('audio');
            const videos = mediaContainer.querySelectorAll('video');

            const imageAspectRatio = calculateAverageAspectRatio(images, defaultImageRatio);
            const audioAspectRatio = calculateAverageAspectRatio(audios, defaultAudioRatio);
            const videoAspectRatio = calculateAverageAspectRatio(videos, defaultVideoRatio);

            // Wende die Seitenverhältnisse auf den Container an
            applyAspectRatioToContainer(mediaContainer, imageAspectRatio, 'img');
            applyAspectRatioToContainer(mediaContainer, audioAspectRatio, 'audio');
            applyAspectRatioToContainer(mediaContainer, videoAspectRatio, 'video');
        });
    });

    // Initialisierung vor DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMedia);
    } else {
        initializeMedia();
    }

    // Darkmode und Sidebar-Steuerung
    const darkModeToggle = document.querySelector('.toggle-container');
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('sidebar-toggle');

    // Darkmode-Status bei neuem Laden der Seite verwenden
    if (localStorage.getItem('darkmode') === 'enabled') {
        document.body.classList.add('darkmode');
        darkModeToggle.classList.add('dark');
    }

    // Darkmode umschalten und speichern
    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('darkmode');
        darkModeToggle.classList.toggle('dark');
        localStorage.setItem('darkmode', isDarkMode ? 'enabled' : 'disabled');
    });

    // Zurücksetzen des Darkmodes beim Navigieren zwischen Unterseiten
    window.addEventListener('beforeunload', () => {
        // Darkmode beim Verlassen zurücksetzen
        localStorage.removeItem('darkmode');
        document.body.classList.remove('darkmode');
        darkModeToggle.classList.remove('dark');
    });

    if (localStorage.getItem('sidebar') === 'collapsed') {
        sidebar.classList.add('collapsed');
        document.querySelectorAll('.sidebar nav ul li a').forEach(item => {
            item.style.display = 'none';
        });
    }

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        document.querySelectorAll('.sidebar nav ul li a').forEach(item => {
            item.style.display = isCollapsed ? 'none' : 'block';
        });
        localStorage.setItem('sidebar', isCollapsed ? 'collapsed' : 'expanded');
    });

    sidebar.addEventListener('transitionend', () => {
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebar', isCollapsed ? 'collapsed' : 'expanded');
    });
})();

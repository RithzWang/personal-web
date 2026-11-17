// --- SOCIAL ICONS ANIMATION ---
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('click', function () {
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 200);
    });
});

// --- FETCH SPOTIFY STATUS ---
async function getSpotifyStatus() {
    try {
        const response = await fetch('https://rido-z.onrender.com/v1/spotify');
        if (!response.ok) return;

        const data = await response.json();
        if (!data.success) return;

        const spotifyStatus = document.getElementById('spotify-status');
        const spotifySong = document.getElementById('spotify-song');

        if (spotifyStatus && spotifySong) {
            if (data.listening_to_spotify && data.spotify) {
                spotifySong.textContent = data.spotify.song;
                spotifySong.href = data.spotify.track_url || 'https://open.spotify.com';
                spotifyStatus.classList.add('is-playing');
            } else {
                spotifyStatus.classList.remove('is-playing');
                spotifySong.textContent = '';
            }
        }
    } catch (error) {
        console.error("Error fetching Spotify status:", error);
    } finally {
        setTimeout(getSpotifyStatus, 5000);
    }
}

getSpotifyStatus();

// --- FLAG ICONS & TOOLTIPS CLICK ANIMATION ---
document.querySelectorAll('.flag-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function () {
        const icon = this.querySelector('.flag-icon');
        
        icon.classList.add('clicked');
        setTimeout(() => {
            icon.classList.remove('clicked');
        }, 200);

        document.querySelectorAll('.flag-wrapper').forEach(w => w.classList.remove('show-tooltip'));
        this.classList.add('show-tooltip');
        
        setTimeout(() => {
            this.classList.remove('show-tooltip');
        }, 5000); 
    });
});

// Existing code for social icons
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('click', function () {
        this.classList.add('clicked'); 
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 200);
    });
});

const DISCORD_ID = "837741275603009626"; 

async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();
        const discordUser = data.data.discord_user;
        const spotifyData = data.data.spotify;

        // --- 1. HANDLE SPOTIFY ---
        const spotifyContainer = document.getElementById('spotify-container');
        if (spotifyContainer) { // Check if element exists
            if (spotifyData) {
                spotifyContainer.style.display = 'block';
                document.getElementById('spotify-album-art').src = spotifyData.album_art_url;
                document.getElementById('spotify-song-title').textContent = spotifyData.song;
                document.getElementById('spotify-artist-name').textContent = spotifyData.artist;
            } else {
                spotifyContainer.style.display = 'none';
            }
        }

        // --- 2. HANDLE AVATAR DECORATION ---
        const decorationImg = document.getElementById('discord-decoration');
        if (decorationImg) {
            const decorationHash = discordUser.avatar_decoration;
            
            if (decorationHash) {
                // Construct the Discord CDN URL
                const decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png?size=160&passthrough=true`;
                decorationImg.src = decorationUrl;
                decorationImg.style.display = 'block';
            } else {
                decorationImg.style.display = 'none';
            }
        }

    } catch (error) {
        console.error("Error fetching Discord status:", error);
    }
}

// Run immediately
getDiscordStatus();

// Update every 5 seconds
setInterval(getDiscordStatus, 5000);

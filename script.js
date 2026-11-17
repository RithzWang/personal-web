// --- SOCIAL ICONS ANIMATION ---
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('click', function () {
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 200);
    });
});

// --- VARIABLES ---
const DISCORD_ID = "792341624797265930";

// --- FETCH DISCORD STATUS ---
async function getDiscordStatus() {
    try {
        const response = await fetch(`https://rido-z.onrender.com/v1/users/${DISCORD_ID}`);
        if (!response.ok) return;

        const data = await response.json();
        if (!data.success) return;

        // --- 1. DISCORD STATUS GLOW ---
        const discordStatus = data.data.discord_status;
        const profilePic = document.querySelector('.profile-picture');

        if (profilePic) {
            profilePic.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');
            profilePic.classList.add(discordStatus ? `status-${discordStatus}` : 'status-offline');
        }

        // --- 2. SPOTIFY INLINE TEXT ---
        const spotifyStatus = document.getElementById('spotify-status');
        const spotifySong = document.getElementById('spotify-song');

        if (spotifyStatus && spotifySong) {
            if (data.data.listening_to_spotify && data.data.spotify) {
                spotifySong.textContent = data.data.spotify.song;
                spotifySong.href = data.data.spotify.track_url || 'https://open.spotify.com';
                spotifyStatus.style.display = 'inline-flex';
            } else {
                spotifyStatus.style.display = 'none';
                spotifySong.textContent = '';
            }
        }
    } catch (error) {
        console.error("Error fetching Discord status:", error);
    } finally {
        setTimeout(getDiscordStatus, 5000);
    }
}

getDiscordStatus();



// --- FLAG ICONS & TOOLTIPS CLICK ANIMATION ---
document.querySelectorAll('.flag-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function () {
        const icon = this.querySelector('.flag-icon');
        
        // 1. Do the bounce animation on the flag image
        icon.classList.add('clicked');
        setTimeout(() => {
            icon.classList.remove('clicked');
        }, 200);

        // 2. Hide tooltips from any OTHER flags we previously clicked
        document.querySelectorAll('.flag-wrapper').forEach(w => w.classList.remove('show-tooltip'));
        
        // 3. Show the tooltip for the flag we just clicked
        this.classList.add('show-tooltip');
        
        // 4. Automatically hide the tooltip after 5 seconds
        setTimeout(() => {
            this.classList.remove('show-tooltip');
        }, 5000); 
    });
});


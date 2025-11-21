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
const DISCORD_ID = "837741275603009626";
let songStartTimestamp = 0;
let songEndTimestamp = 0;
let isPlaying = false;

// --- FETCH DATA FROM DISCORD ---
async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();

        if (!data.success) return;

        const discordUser = data.data.discord_user;
        const spotifyData = data.data.spotify;

        // 1. AUTO-UPDATE PROFILE PICTURE
        const profileImg = document.querySelector('.profile-picture');
        if (profileImg && discordUser.avatar) {
            const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${discordUser.avatar}.png?size=512`;
            if (profileImg.src !== avatarUrl) profileImg.src = avatarUrl;
        }

        // 2. AVATAR DECORATION
        const decorationImg = document.getElementById('discord-decoration');
        if (decorationImg) {
            const decorationHash = discordUser.avatar_decoration_data ? discordUser.avatar_decoration_data.asset : null;
            if (decorationHash) {
                decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png?size=160&passthrough=true`;
                decorationImg.style.display = 'block';
            } else {
                decorationImg.style.display = 'none';
            }
        }

        // 3. SPOTIFY DATA
        const spotifyContainer = document.getElementById('spotify-container');
        const progressWrapper = document.querySelector('.spotify-progress-wrapper'); // NEW: Select the progress bar

        if (spotifyContainer) {
            spotifyContainer.style.display = 'flex'; 

            if (spotifyData) {
                isPlaying = true;
                songStartTimestamp = spotifyData.timestamps.start;
                songEndTimestamp = spotifyData.timestamps.end;

                document.getElementById('spotify-album-art').src = spotifyData.album_art_url;
                document.getElementById('spotify-song-title').textContent = spotifyData.song;
                document.getElementById('spotify-artist-name').textContent = spotifyData.artist;
                document.getElementById('spotify-album-art').style.filter = "none";
                
                // Link to song
                spotifyContainer.onclick = () => window.open(`https://open.spotify.com/track/${spotifyData.track_id}`, '_blank');
                spotifyContainer.style.cursor = "pointer";

                // SHOW PROGRESS BAR
                if (progressWrapper) progressWrapper.style.display = 'flex'; 

            } else {
                isPlaying = false;
                document.getElementById('spotify-album-art').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png';
                document.getElementById('spotify-song-title').textContent = 'Not Playing';
                document.getElementById('spotify-artist-name').textContent = 'Spotify';
                document.getElementById('spotify-album-art').style.filter = "grayscale(100%)";
                
                // HIDE PROGRESS BAR completely when not playing
                if (progressWrapper) progressWrapper.style.display = 'none'; 
                
                spotifyContainer.onclick = null;
                spotifyContainer.style.cursor = "default";
            }
        }

    } catch (error) {
        console.error("Error fetching Discord status:", error);
    }
}

// --- PROGRESS BAR LOGIC ---
function updateProgressBar() {
    // If music isn't playing, stop the function here so it doesn't error
    if (!isPlaying) return; 

    const now = Date.now();
    const totalDuration = songEndTimestamp - songStartTimestamp;
    const currentProgress = now - songStartTimestamp;
    
    // Calculate percentage
    let percentage = (currentProgress / totalDuration) * 100;
    if (percentage > 100) percentage = 100;

    // Update Bar Width
    const barFill = document.getElementById('spotify-progress-fill');
    if (barFill) barFill.style.width = `${percentage}%`;

    // Update Time Text
    const timeCurr = document.getElementById('spotify-time-current');
    const timeTot = document.getElementById('spotify-time-total');
    
    if (timeCurr) timeCurr.innerText = formatTime(currentProgress);
    if (timeTot) timeTot.innerText = formatTime(totalDuration);
}

// Helper: Convert milliseconds to MM:SS
function formatTime(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// --- TIMERS ---
getDiscordStatus(); 
setInterval(getDiscordStatus, 5000); 
setInterval(updateProgressBar, 1000); 

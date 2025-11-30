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

// --- FETCH DATA FROM DISCORD (LANYARD) ---
async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();

        if (!data.success) return;

        const spotifyData = data.data.spotify;

        // 2. SPOTIFY DATA
        const spotifyContainer = document.getElementById('spotify-container');
        const progressWrapper = document.querySelector('.spotify-progress-wrapper');

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

                // Ensure bar is visible
                if (progressWrapper) progressWrapper.style.display = 'flex'; 

            } else {
                isPlaying = false;
                document.getElementById('spotify-album-art').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png';
                document.getElementById('spotify-song-title').textContent = 'Not Found';
                document.getElementById('spotify-artist-name').textContent = 'Spotify';
                document.getElementById('spotify-album-art').style.filter = "grayscale(100%)";
                
                // --- VISUAL RESET (Keep showing 0:00) ---
                if (progressWrapper) {
                    progressWrapper.style.display = 'flex'; // Keep it visible
                    document.getElementById('spotify-progress-fill').style.width = '0%';
                    document.getElementById('spotify-time-current').innerText = '0:00';
                    document.getElementById('spotify-time-total').innerText = '0:00';
                }
                
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
    if (!isPlaying) return; // Stop calculating if music is off

    const now = Date.now();
    const totalDuration = songEndTimestamp - songStartTimestamp;
    const currentProgress = now - songStartTimestamp;
    
    let percentage = (currentProgress / totalDuration) * 100;
    if (percentage > 100) percentage = 100;

    const barFill = document.getElementById('spotify-progress-fill');
    if (barFill) barFill.style.width = `${percentage}%`;

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

// --- SNOWFALL LOGIC ---

// Symbols for a slight variation
const SNOWFLAKE_SYMBOLS = ['fa-snowflake', 'fa-star', 'fa-sparkle']; 

function createSnowflake() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;

    // Use <i> for Font Awesome Icon
    const snowflake = document.createElement('i');
    
    // Add base classes, plus a random icon for variation
    const symbolClass = SNOWFLAKE_SYMBOLS[Math.floor(Math.random() * SNOWFLAKE_SYMBOLS.length)];
    snowflake.classList.add('snowflake', 'fa-regular', symbolClass);
    
    // Random initial position (start above the screen)
    const startX = Math.random() * 100;
    snowflake.style.left = `${startX}vw`;
    snowflake.style.top = `${-5 - Math.random() * 10}vh`; // Start above screen

    // Random duration for falling
    const fallDuration = Math.random() * 10 + 5; // 5 to 15 seconds
    const swayDuration = Math.random() * 5 + 3; // 3 to 8 seconds for horizontal sway
    snowflake.style.animationDuration = `${fallDuration}s, ${swayDuration}s`; 

    // Random size
    const size = Math.random() * 12 + 8; // 8px to 20px
    snowflake.style.fontSize = `${size}px`;

    // Add to container
    snowContainer.appendChild(snowflake);

    // Clean up: Remove the element after the animation is complete (with buffer)
    setTimeout(() => {
        snowflake.remove();
    }, (fallDuration * 1000) + 1000);
}

// Start generating snowflakes every 500ms
setInterval(createSnowflake, 500);


// --- TIMERS ---
getDiscordStatus(); 
setInterval(getDiscordStatus, 5000); 
setInterval(updateProgressBar, 1000);

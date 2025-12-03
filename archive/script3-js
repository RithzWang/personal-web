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

        const spotifyData = data.data.spotify;
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
                
                // Link to song (Fixed variable interpolation)
                spotifyContainer.onclick = () => window.open(`https://open.spotify.com/track/$${spotifyData.track_id}`, '_blank');
                spotifyContainer.style.cursor = "pointer";

                if (progressWrapper) progressWrapper.style.display = 'flex'; 

            } else {
                isPlaying = false;
                document.getElementById('spotify-album-art').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png';
                document.getElementById('spotify-song-title').textContent = 'Not Found';
                document.getElementById('spotify-artist-name').textContent = 'Spotify';
                document.getElementById('spotify-album-art').style.filter = "grayscale(100%)";
                
                if (progressWrapper) {
                    progressWrapper.style.display = 'flex'; 
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
    if (!isPlaying) return; 

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

function formatTime(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// --- TIMERS ---
getDiscordStatus(); 
setInterval(getDiscordStatus, 1000); 
setInterval(updateProgressBar, 1000);


// --- SIDEBAR TOGGLE LOGIC ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const expandBtn = document.getElementById('expand-btn');

    // Toggle classes
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Hide 'Expand' button when open, show when closed
    if (sidebar.classList.contains('active')) {
        expandBtn.style.left = "-50px"; // Hide it off-screen
    } else {
        expandBtn.style.left = "0"; // Bring it back
    }
}


// Set birthdate: March 15, 2007
// Month is 2 because JavaScript counts months starting at 0 (Jan=0, Feb=1, Mar=2)
const birthDate = new Date(2007, 2, 15); 

const ageElement = document.getElementById("my-age");

function updateAge() {
    const now = new Date();
    
    // Calculate the difference in milliseconds
    const diff = now - birthDate;

    // Convert milliseconds to years
    // We divide by (1000ms * 60s * 60m * 24h * 365.25 days)
    const ageInYears = diff / 31557600000;

    // Update the text to show 9 decimal places
    ageElement.innerText = ageInYears.toFixed(9);
}

// Update every 50 milliseconds for the animation effect
setInterval(updateAge, 50);

// Run immediately so there is no delay on load
updateAge();


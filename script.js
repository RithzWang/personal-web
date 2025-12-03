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

// Lyrics Variables
let currentTrackId = null;
let currentLyrics = []; 
let lyricsActive = false;

// --- FETCH DATA FROM DISCORD ---
async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();

        if (!data.success) return;

        const spotifyData = data.data.spotify;
        const spotifyContainer = document.getElementById('spotify-container');
        const progressWrapper = document.querySelector('.spotify-progress-wrapper');
        const lyricsElement = document.getElementById('spotify-lyrics');

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
                
                // --- NEW: Check if song changed to fetch new lyrics ---
                if (currentTrackId !== spotifyData.track_id) {
                    currentTrackId = spotifyData.track_id;
                    // Reset lyrics immediately to avoid showing old song lyrics
                    if (lyricsElement) lyricsElement.innerText = "Loading lyrics...";
                    fetchLyrics(spotifyData.song, spotifyData.artist, (songEndTimestamp - songStartTimestamp) / 1000);
                }

                // Fixed the variable syntax here
                spotifyContainer.onclick = () => window.open(`https://open.spotify.com/track/${spotifyData.track_id}`, '_blank');
                spotifyContainer.style.cursor = "pointer";

                if (progressWrapper) progressWrapper.style.display = 'flex'; 

            } else {
                // Not Playing
                isPlaying = false;
                lyricsActive = false;
                currentTrackId = null;
                if (lyricsElement) lyricsElement.innerText = ''; // Clear lyrics

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

// --- FETCH LYRICS FUNCTION ---
async function fetchLyrics(track, artist, duration) {
    // Reset
    currentLyrics = [];
    lyricsActive = false;
    const lyricsElement = document.getElementById('spotify-lyrics');

    try {
        // Using Lrclib API (Free & Open Source)
        const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}&duration=${Math.round(duration)}`;
        
        const response = await fetch(url);
        
        // If API returns 404 or error
        if (!response.ok) {
            if (lyricsElement) lyricsElement.innerText = ""; // Hide text if no lyrics
            return;
        }
        
        const data = await response.json();
        
        if (data && data.syncedLyrics) {
            currentLyrics = parseLrc(data.syncedLyrics);
            lyricsActive = true;
            if (lyricsElement) lyricsElement.innerText = ""; // Ready to start showing
        } else {
            if (lyricsElement) lyricsElement.innerText = ""; // No synced lyrics found
        }
    } catch (err) {
        if (lyricsElement) lyricsElement.innerText = "";
        console.log("Lyrics fetch error:", err);
    }
}

// --- PARSER: Convert LRC string to usable Array ---
function parseLrc(lrc) {
    const lines = lrc.split('\n');
    const result = [];
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2})\]/;

    lines.forEach(line => {
        const match = timeReg.exec(line);
        if (match) {
            const min = parseInt(match[1]);
            const sec = parseInt(match[2]);
            const ms = parseInt(match[3]);
            const time = min * 60 + sec + ms / 100;
            const text = line.replace(timeReg, '').trim();
            // We push even empty strings if you want to clear the line during instrumental breaks
            result.push({ time, text });
        }
    });
    return result;
}

// --- PROGRESS BAR & LYRIC SYNC LOGIC ---
function updateProgressBar() {
    if (!isPlaying) return; 

    const now = Date.now();
    const totalDuration = songEndTimestamp - songStartTimestamp;
    const currentProgress = now - songStartTimestamp;
    
    // Update Bar
    let percentage = (currentProgress / totalDuration) * 100;
    if (percentage > 100) percentage = 100;

    const barFill = document.getElementById('spotify-progress-fill');
    if (barFill) barFill.style.width = `${percentage}%`;

    // Update Time Text
    const timeCurr = document.getElementById('spotify-time-current');
    const timeTot = document.getElementById('spotify-time-total');
    
    if (timeCurr) timeCurr.innerText = formatTime(currentProgress);
    if (timeTot) timeTot.innerText = formatTime(totalDuration);

    // --- LYRIC SYNC UPDATE ---
    const lyricsElement = document.getElementById('spotify-lyrics');
    if (lyricsActive && currentLyrics.length > 0 && lyricsElement) {
        const currentSec = currentProgress / 1000;
        
        // Find the correct line for the current time
        let currentLine = lyricsElement.innerText; // Default to keeping current
        
        // We iterate to find the last line that has a timestamp <= current time
        // A simple loop is fine for the small amount of lines in a song
        let foundLine = null;
        for (let i = 0; i < currentLyrics.length; i++) {
            if (currentLyrics[i].time <= currentSec) {
                foundLine = currentLyrics[i].text;
            } else {
                break; // Stop once we pass the current time
            }
        }

        if (foundLine !== null && foundLine !== currentLine) {
            lyricsElement.innerText = foundLine;
        }
    }
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
setInterval(updateProgressBar, 1000); // 1000ms is standard, 100ms makes the bar smoother but uses more CPU


// --- SIDEBAR TOGGLE LOGIC ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const expandBtn = document.getElementById('expand-btn');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        expandBtn.style.left = "-50px"; 
    } else {
        expandBtn.style.left = "0"; 
    }
}


// --- AGE COUNTER ---
const birthDate = new Date(2007, 2, 15); 
const ageElement = document.getElementById("my-age");

function updateAge() {
    const now = new Date();
    const diff = now - birthDate;
    const ageInYears = diff / 31557600000;
    ageElement.innerText = ageInYears.toFixed(9);
}

setInterval(updateAge, 50);
updateAge();

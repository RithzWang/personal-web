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

        // --- 1. HANDLE AVATAR DECORATION ---
        const decorationImg = document.getElementById('discord-decoration');
        if (decorationImg) {
            const decorationHash = discordUser.avatar_decoration_data ? discordUser.avatar_decoration_data.asset : discordUser.avatar_decoration;
            if (decorationHash) {
                decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png?size=160&passthrough=true`;
                decorationImg.style.display = 'block';
            } else {
                decorationImg.style.display = 'none';
            }
        }

        
// script.js

// 🔴 REPLACE THESE WITH YOUR REAL KEYS
const client_id = 'a31519d8aee54bdf9c0ed526fece1310'; 
const client_secret = 'a50ee2c9fb21403badf38ffdc2b226e5'; 
const refresh_token = 'YOUR_REFRESH_TOKEN'; 

const basic = btoa(`${client_id}:${client_secret}`);
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

async function getAccessToken() {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
        }),
    });

    return response.json();
}

async function getNowPlaying() {
    const { access_token } = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    // 204 means nothing is playing
    if (response.status === 204 || response.status > 400) {
        return null;
    }

    return response.json();
}

async function updateWidget() {
    const widget = document.getElementById('spotify-widget');
    const trackLink = document.getElementById('track-link');
    const artistName = document.getElementById('artist-name');
    const albumArt = document.getElementById('album-art');
    const statusText = document.getElementById('status-text');
    const bars = document.querySelector('.bars-container');

    try {
        const song = await getNowPlaying();

        if (song && song.is_playing) {
            widget.classList.remove('offline');
            
            const title = song.item.name;
            const artist = song.item.artists.map((_artist) => _artist.name).join(', ');
            const albumImage = song.item.album.images[0].url;
            const link = song.item.external_urls.spotify;

            trackLink.textContent = title;
            trackLink.href = link;
            artistName.textContent = artist;
            albumArt.src = albumImage;
            albumArt.style.display = 'block';
            statusText.style.display = 'none';
            bars.style.display = 'flex';
        } else {
            // Not playing
            widget.classList.add('offline');
            statusText.textContent = 'Not Listening to Anything';
            statusText.style.display = 'block';
            trackLink.textContent = '';
            artistName.textContent = '';
            albumArt.style.display = 'none';
            bars.style.display = 'none';
        }
    } catch (e) {
        console.error("Error fetching Spotify status", e);
    }
}

// Update on load
updateWidget();

// Update every 10 seconds
setInterval(updateWidget, 10000);

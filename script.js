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

// --- FETCH DISCORD STATUS ---
async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();

        if (!data.success) return;

        // --- DISCORD STATUS GLOW ---
        const discordStatus = data.data.discord_status; // "online", "idle", "dnd", or "offline"
        const profilePic = document.querySelector('.profile-picture');
        
        if (profilePic) {
            // Remove any existing status classes
            profilePic.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');
            
            // Apply the new glow class
            if (discordStatus) {
                profilePic.classList.add(`status-${discordStatus}`);
            } else {
                profilePic.classList.add('status-offline');
            }
        }

    } catch (error) {
        console.error("Error fetching Discord status:", error);
    }
}

// --- TIMERS ---
getDiscordStatus(); 
setInterval(getDiscordStatus, 5000); // Polling safely every 5 seconds

// --- SIDEBAR TOGGLE LOGIC ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    const textSpan = document.getElementById('toggle-text');
    const icon = document.getElementById('toggle-icon');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        textSpan.innerText = "Collapse";
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
    } else {
        textSpan.innerText = "About Me";
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
    }
}

// --- PROFILE PICTURE POP ANIMATION ---
const profileImage = document.querySelector('.profile-picture');
if (profileImage) {
    profileImage.addEventListener('click', function() {
        this.classList.add('pop-clicked');
        
        setTimeout(() => {
            this.classList.remove('pop-clicked');
        }, 200);
    });
}

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
setInterval(getDiscordStatus, 5000); 

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
        
        // 4. Automatically hide the tooltip after 2 seconds
        setTimeout(() => {
            this.classList.remove('show-tooltip');
        }, 2000); 
    });
});


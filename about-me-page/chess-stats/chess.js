const username = "NKBOBWIRE";

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChessStats();
});

function initializeChessStats() {
    // Set the title - try multiple selectors
    let titleElement = document.querySelector(".chess-title");
    if (!titleElement) {
        titleElement = document.querySelector("h2.chess-title");
    }
    if (!titleElement) {
        // Create title element if it doesn't exist
        const statsContainer = document.querySelector(".stats-container");
        if (statsContainer) {
            titleElement = document.createElement("h2");
            titleElement.className = "chess-title";
            statsContainer.insertBefore(titleElement, statsContainer.firstChild);
        }
    }

    if (titleElement) {
        titleElement.textContent = username.toUpperCase() + " CHESS STATS";
        console.log("Chess title set successfully");
    } else {
        console.error("Error: Could not find or create chess title element.");
    }

    // Fetch and display stats
    fetchStats();
}

// Helper function to safely update element content
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
        return true;
    } else {
        console.error(`Error: Element with ID '${id}' not found.`);
        return false;
    }
}

async function fetchStats() {
    const url = `https://api.chess.com/pub/player/${username}/stats`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Chess.com API Response:', data); // Debug log

        // Update stats with better null checking and ELO labels
        const stats = {
            games: data.chess_rapid?.record
                ? data.chess_rapid.record.win + data.chess_rapid.record.loss + data.chess_rapid.record.draw
                : "N/A",
            puzzles: data.tactics?.highest?.rating
                ? `${data.tactics.highest.rating} ELO`
                : "N/A",
            rapid: data.chess_rapid?.last?.rating
                ? `${data.chess_rapid.last.rating} ELO`
                : "N/A",
            daily: data.chess_daily?.last?.rating
                ? `${data.chess_daily.last.rating} ELO`
                : "N/A",
            blitz: data.chess_blitz?.last?.rating
                ? `${data.chess_blitz.last.rating} ELO`
                : "N/A",
            bullet: data.chess_bullet?.last?.rating
                ? `${data.chess_bullet.last.rating} ELO`
                : "N/A"
        };

        // Update all stat elements
        Object.entries(stats).forEach(([key, value]) => {
            updateElement(key, value);
        });

    } catch (error) {
        console.error("Error fetching chess stats:", error);

        // Set all stat values to "Error" on failure
        const statIds = ['games', 'puzzles', 'rapid', 'daily', 'blitz', 'bullet'];
        statIds.forEach(id => {
            updateElement(id, "Error");
        });
    }
}
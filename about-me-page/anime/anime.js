document.addEventListener('DOMContentLoaded', () => {
    const animeList = [
        { title: "Blue Lock", img: "anime-images/blue-lock.png" },
        { title: "Death Note", img: "anime-images/death-note.png" },
        { title: "Demon Slayer", img: "anime-images/demon-slayer.png" },
        { title: "Attack on Titan", img: "anime-images/aot.png" },
        { title: "Jujutsu Kaisen", img: "anime-images/jjk.png" },
        { title: "Solo Leveling", img: "anime-images/sl.png" },
        { title: "COTE", img: "anime-images/cote.png" },
        { title: "Shield Hero", img: "anime-images/sh.png" }
    ];

    const gridContainer = document.getElementById('anime-grid');

    if (gridContainer) {
        gridContainer.innerHTML = animeList.map(anime => `
            <div class="anime-tile">
                <img src="${anime.img}" alt="${anime.title}" loading="lazy">
                <div class="tile-overlay">
                    <h3>${anime.title}</h3>
                </div>
            </div>
        `).join('');
    }
});
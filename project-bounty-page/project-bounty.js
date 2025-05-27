document.addEventListener("DOMContentLoaded", function() {
    const firebaseConfig = {
        apiKey: "AIzaSyCFfXxB6ZKSUUkw6i1knjKudk48sWwd3f8",
        authDomain: "muhais-bounties.firebaseapp.com",
        databaseURL: "https://muhais-bounties-default-rtdb.firebaseio.com",
        projectId: "muhais-bounties",
        storageBucket: "muhais-bounties.firebasestorage.app",
        messagingSenderId: "454566960560",
        appId: "1:454566960560:web:5ac7db55d66be8c02a0a75",
        measurementId: "G-XXN6VTEB32"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    const bountyList = document.getElementById("bounties-list");
    const loadingText = document.getElementById("loading");

    db.ref("bounties").on("value", (snapshot) => {
        const bounties = snapshot.val();
        bountyList.innerHTML = "";
        loadingText.style.display = "none";
        if (!bounties) return;

        const sorted = Object.entries(bounties).sort((a, b) => (b[1].votes || 0) - (a[1].votes || 0));
        sorted.forEach(([id, bounty]) => {
            const item = document.createElement("div");
            item.className = "bounty-item";

            const left = document.createElement("div");
            left.innerHTML = `
                <strong>${bounty.title}</strong>
                <p style="margin: 5px 0; color: #cccccc;">${bounty.description}</p>
            `;

            const voteBox = document.createElement("div");
            voteBox.className = "vote-buttons";

            const up = document.createElement("div");
            up.className = "vote-button";
            up.innerHTML = `<i class="fas fa-thumbs-up"></i> ${bounty.votes || 0}`;
            up.onclick = () => {
                const newVoteCount = (bounty.votes || 0) + 1;
                db.ref(`bounties/${id}/votes`).set(newVoteCount);
                showVoteConfirmation();

                if (newVoteCount >= 10 && !bounty.notified) {
                    fetch("/api/notify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: bounty.title,
                            description: bounty.description,
                            votes: newVoteCount,
                        }),
                    });
                }
            };

            const down = document.createElement("div");
            down.className = "vote-button";
            down.innerHTML = `<i class="fas fa-thumbs-down"></i> ${bounty.dislikes || 0}`;
            down.onclick = () => {
                db.ref(`bounties/${id}/dislikes`).set((bounty.dislikes || 0) + 1);
                showVoteConfirmation();
            };

            voteBox.appendChild(up);
            voteBox.appendChild(down);

            item.appendChild(left);
            item.appendChild(voteBox);
            bountyList.appendChild(item);
        });
    });

    function showVoteConfirmation() {
        const el = document.getElementById("vote-confirmation");
        el.style.display = "block";
        el.classList.remove("fade-out");

        setTimeout(() => {
            el.style.display = "none";
        }, 3000);
    }
});
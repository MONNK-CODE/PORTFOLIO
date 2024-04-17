function fetchRepoLanguages(owner, cardTitleElement) {
  const repoName = cardTitleElement.textContent.trim();
  const url = `https://api.github.com/repos/${owner}/${repoName}/languages`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const totalBytes = Object.values(data).reduce((acc, val) => acc + val, 0);
      const card = cardTitleElement.closest('.project-card');
      const languageStatsElement = card.querySelector('.language-stats');
      languageStatsElement.innerHTML = '';

      Object.keys(data).forEach(key => {
        const percentage = ((data[key] / totalBytes) * 100).toFixed(1);
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${key}:</span> ${percentage}%`;
        languageStatsElement.appendChild(listItem);
      });
    })
    .catch(error => console.error('Fetching error:', error));
}

window.onload = () => {
  const cardTitles = document.querySelectorAll('.card-title');

  cardTitles.forEach(cardTitleElement => {
    fetchRepoLanguages('MONNK-CODE', cardTitleElement);
  });
};


document.addEventListener("DOMContentLoaded", function() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", function() {
      const category = this.textContent.trim().toLowerCase();
      projectCards.forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
          card.classList.remove("filtered");
        } else {
          card.classList.add("filtered");
        }
      });
    });
  });
});



document.addEventListener("DOMContentLoaded", function() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(button => {
    button.addEventListener("click", function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove("active"));
      // Add active class to the clicked button
      this.classList.add("active");
    });
  });
});



// document.getElementById('viewProject').addEventListener('click', function() {
//   window.open('https://monnk-code.github.io/Instant-Ayah/', '_blank', 'noopener,noreferrer');
// });











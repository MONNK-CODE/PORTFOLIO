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
      const card = cardTitleElement.closest('.card');
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
// Function to fetch programming languages used in a GitHub repository and display their statistics
function fetchRepoLanguages(cardTitleElement, cardOwnerElement) {
  // Extract the repository name and owner from the card elements
  const repoName = cardTitleElement.textContent.trim();
  const owner = cardOwnerElement.textContent.trim();

  // Construct the GitHub API URL to fetch repository languages
  const url = `https://api.github.com/repos/${owner}/${repoName}/languages`;

  // Make an API request to fetch the language data
  fetch(url)
      .then(response => {
        // Check if the response is valid (HTTP status 200–299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        // Calculate the total number of bytes for all languages
        const totalBytes = Object.values(data).reduce((acc, val) => acc + val, 0);

        // Find the parent card element to display the results
        const card = cardTitleElement.closest('.project-card');

        // Select the element where language statistics will be displayed
        const languageStatsElement = card.querySelector('.language-stats');
        languageStatsElement.innerHTML = ''; // Clear any existing content

        // Iterate over each language in the response
        Object.keys(data).forEach(key => {
          // Calculate the percentage of the language in the repository
          const percentage = ((data[key] / totalBytes) * 100).toFixed(1);

          // Create a new list item for the language and its percentage
          const listItem = document.createElement('li');
          listItem.innerHTML = `<span>${key}:</span> ${percentage}%`;

          // Append the list item to the language stats element
          languageStatsElement.appendChild(listItem);
        });
      })
      .catch(error => console.error('Fetching error:', error)); // Log any errors to the console
}

// Run this code when the window has finished loading
window.onload = () => {
  // Select all project card elements
  const cards = document.querySelectorAll('.project-card');

  // Loop through each project card
  cards.forEach(card => {
    // Get the repository title and owner elements from the card
    const cardTitleElement = card.querySelector('.card-title');
    const cardOwnerElement = card.querySelector('.card-owner');

    // Ensure both title and owner elements exist before proceeding
    if (cardTitleElement && cardOwnerElement) {
      // Fetch and display the repository's language data
      fetchRepoLanguages(cardTitleElement, cardOwnerElement);
    }
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

      filterButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

//Project Subscribers
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('subscription-form');
  const subscribeMessage = document.getElementById('subscribe-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('subscriber-email').value;
    const name = document.getElementById('subscriber-name').value;

    if (!validateEmail(email)) {
      subscribeMessage.style.color = '#dc3545';
      subscribeMessage.textContent = 'Please enter a valid email address.';
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriber_email: email, subscriber_name: name }),
      });

      const result = await response.json();

      if (response.ok) {
        subscribeMessage.style.color = '#28a745';
        subscribeMessage.textContent = result.message;
        form.reset();
      } else {
        throw new Error(result.error || 'Subscription failed.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      subscribeMessage.style.color = '#dc3545';
      subscribeMessage.textContent = 'Subscription failed, please try again later.';
    }
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});





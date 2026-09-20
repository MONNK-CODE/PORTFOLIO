document.addEventListener('DOMContentLoaded', function() {
  // Function to scroll to an element
  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Check URL parameters when page loads
  const urlParams = new URLSearchParams(window.location.search);
  const scrollTo = urlParams.get('scrollTo');
  if (scrollTo) {
    scrollToElement(scrollTo);
  }
});




// VISITOR COUNTER
document.addEventListener("DOMContentLoaded", function () {
  const counterElement = document.getElementById("visitor-count");

  fetch("api/visitor-counter")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Counter error: ${response.status}`);
        }

        return response.json();
      })
      .then(data => {
        counterElement.textContent = data.count;
      })
      .catch(error => {
        console.error("Counter Error:", error);
        counterElement.textContent = "—";
      });
});

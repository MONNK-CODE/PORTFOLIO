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

// QUOTE GENERATOR
  const quotes = [
    "Your future is built in the quiet hours no one applauds.",
    "Discomfort is the tuition you pay for growth.",
    "When you can’t see the whole path, take the step that’s in front of you."
  ];

  function typeEffect(text, elementId, speed = 50) {
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    let i = 0;

    function typing() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      }
    }

    typing();
  }

  window.onload = function () {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    typeEffect(randomQuote, 'quoteDisplay', 40); // You can adjust speed here
  };
  // QUOTE GENERATOR END
});


// VISITOR COUNTER
  function displayCount(data) {
  const counterElement = document.getElementById('visitor-count');
  if (counterElement && data.count) {
  counterElement.innerText = data.count;
  }
}
// API CALL
  const namespace = "muhais-olatundun"; //workspace
  const key = "first-counter-2519"; //slug

  fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
  .then(response => {
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
})
  .then(data => {
  displayCount(data);
})
  .catch(error => {
  console.error('Counter Error:', error);
  // Fallback text if the API fails
  document.getElementById('visitor-count').innerText = "1";
});


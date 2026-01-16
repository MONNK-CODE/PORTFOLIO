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
 // Callback function to update the HTML with the count
  function updateCounter(response) {
  document.getElementById('visitor-count').innerText = response.value;
}

  // Connect to the API
  // The "hit" endpoint increases the count by 1 every time the page loads
  const countScript = document.createElement('script');
  countScript.src = 'https://api.countapi.xyz/hit/ut_0w0POvoh0DEjrG1tjvjcumXjlu2cgnlciN7sMUdw/visits?callback=updateCounter';
  document.head.appendChild(countScript);


function downloadResume() {
  const link = document.createElement('a');
  link.href = 'RESUME.pdf';
  link.download = 'Muhais-Olatundun-Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// document.addEventListener('DOMContentLoaded', function() {
//   const contact = document.querySelector('.contact-section');
//   const contactbtn = document.querySelector('.contact');
//
//   if (contact && contactbtn) {
//     contactbtn.addEventListener('click', function() {
//       contact.scrollIntoView({ behavior: 'smooth' });
//     });
//   }
// });
document.addEventListener('DOMContentLoaded', function() {
  // Function to scroll to an element
  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handle click on contact link
  // const contactLink = document.querySelector('.contact-link');
  // if (contactLink) {
  //   contactLink.addEventListener('click', function(e) {
  //     e.preventDefault();
  //     scrollToElement('contact-section');
  //   });
  // }

  // Check URL parameters when page loads
  const urlParams = new URLSearchParams(window.location.search);
  const scrollTo = urlParams.get('scrollTo');
  if (scrollTo) {
    scrollToElement(scrollTo);
  }

// QUOTE GENERATOR
  const quotes = [
    "We rarely seek true originality, for it demands a future we can't yet bear. Instead, we cling to patterns, the echoes of what's already broken, mistaking familiarity for comfort.",
    "The grand illusion isn't finding something new, but the slow, quiet realization that everything is merely a replayed pattern. We've lost the capacity for true wonder, settling instead for the melancholic comfort of recognition.",
    "Real eyes realize real lies",
    // Pulchritudinous
    "True beauty lies in what demands no praise, yet commands silent reverence.",
    // Latter
    "Between memory and hope, the true compass points not to what was, but to what quietly awaits its turn.",
    // Elucidates
    "A wise teacher lights not the path but the lantern within, turning whispers of confusion into choruses of clarity.",
    // Ambidextrous
    "He painted with both brushes, each stroke a debate between chaos and order—neither claiming victory, both shaping the masterpiece."
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





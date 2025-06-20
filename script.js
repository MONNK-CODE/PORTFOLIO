// RESUME START
function viewResume() {
  const modal = document.getElementById('resumeModal');
  const iframe = document.getElementById('resumeFrame');

  // Set the PDF source
  iframe.src = 'RESUME.pdf';

  // Show the modal
  modal.style.display = 'block';

  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
  const modal = document.getElementById('resumeModal');
  const iframe = document.getElementById('resumeFrame');

  // Hide the modal
  modal.style.display = 'none';

  // Clear the iframe source to stop loading
  iframe.src = '';

  // Restore body scroll
  document.body.style.overflow = 'auto';
}

function downloadResume() {
  const link = document.createElement('a');
  link.href = 'RESUME.pdf';
  link.download = 'Muhais-Olatundun-Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('resumeModal');
  if (event.target === modal) {
    closeResumeModal();
  }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('resumeModal');
    if (modal.style.display === 'block') {
      closeResumeModal();
    }
  }
});
// RESUME END



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





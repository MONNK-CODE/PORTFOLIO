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

  // Disable zoom on mobile
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && window.innerWidth <= 767) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
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

  // Restore zoom on mobile
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && window.innerWidth <= 767) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
  }
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

// Handle orientation changes on mobile
window.addEventListener('orientationchange', function() {
  const modal = document.getElementById('resumeModal');
  if (modal.style.display === 'block') {
    // Small delay to allow orientation change to complete
    setTimeout(() => {
      const iframe = document.getElementById('resumeFrame');
      // Reload iframe to adjust to new orientation
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }, 300);
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
    "Your future is built in the quiet hours no one applauds.",
    "Small consistent steps will outlast the grandest burst of effort.",
    "Fear is loud, but purpose is steady—choose the steady voice.",
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





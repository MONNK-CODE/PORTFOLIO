function downloadResume() {
  var link = document.createElement('a');
  link.href = 'RESUME.pdf';
  link.download = 'MuhaisOlatundun-Resume-2024.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', function() {
  const contact = document.querySelector('.contact-section');
  const contactbtn = document.querySelector('.contact');

  if (contact && contactbtn) { 
    contactbtn.addEventListener('click', function() {
      contact.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  // Function to scroll to an element
  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handle click on contact link
  const contactLink = document.querySelector('.contact-link');
  if (contactLink) {
    contactLink.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToElement('contact-section');
    });
  }

  // Check URL parameters when page loads
  const urlParams = new URLSearchParams(window.location.search);
  const scrollTo = urlParams.get('scrollTo');
  if (scrollTo) {
    scrollToElement(scrollTo);
  }
});

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

  if (contact && contactbtn) { // this Check if both elements are found
    contactbtn.addEventListener('click', function() {
      contact.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

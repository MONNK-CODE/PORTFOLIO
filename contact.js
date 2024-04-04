document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Extract the data from the form
      var firstName = document.querySelector('[name="first_name"]').value;
      var lastName = document.querySelector('[name="last_name"]').value;
      var emailAddress = document.querySelector('[name="email"]').value;
      var message = document.querySelector('[name="message"]').value;

      // Send email using EmailJS
      emailjs.send("service_7des06e", "template_1rk1kak", { // Use your Service ID and Template ID
          "firstName": firstName,
          "lastName": lastName,
          "emailAddress": emailAddress,
          "message": message,
      })
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
         alert('Your message has been sent successfully!');
      }, function(error) {
         console.log('FAILED...', error);
         alert('Failed to send the message, please try again.');
      });
    });
  } else {
    console.log('Form not found');
  }
});

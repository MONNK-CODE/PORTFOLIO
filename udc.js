document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Extract the data from the form
      var Name = document.querySelector('[name="first_name"]').value;
      var emailAddress = document.querySelector('[name="email_address"]').value;
      
      // console.log("Name:", Name);
      // console.log("Email Address:", emailAddress);
      
      // Send email using EmailJS
      emailjs.send("service_7des06e","template_0se1syh", { 
          "emailAddress": emailAddress,  
          "Name": Name,      
      })
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
         alert('Your message has been sent successfully!');
        form.reset();
      }, function(error) {
         console.log('FAILED...', error);
         alert('Failed to send the message, please try again.');
      });
    });
  } else {
    console.log('Form not found');
  }

});

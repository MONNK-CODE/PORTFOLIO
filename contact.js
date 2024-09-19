document.addEventListener('DOMContentLoaded', function() {

  (function(){
     emailjs.init("ggYLuSeAb8KgHjiOv"); // THIS IS MY PUBLIC KEY 
  })();

  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      //This Extracts the data from the user in the form 
      var firstName = document.querySelector('[name="first_name"]').value;
      var lastName = document.querySelector('[name="last_name"]').value;
      var emailAddress = document.querySelector('[name="email"]').value;
      var message = document.querySelector('[name="message"]').value;

      // this Sends email using EmailJS API
      emailjs.send("service_7des06e", "template_1rk1kak", { // Service ID and Template ID
          "firstName": firstName,
          "lastName": lastName,
          "emailAddress": emailAddress,
          "message": message,
      })
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
         // USING SweetAlert for success message
         swal({
            title: "Success!",
            text: "Your message has been sent successfully!",
            icon: "success",
          });
         form.reset(); //this resets the input fields
      })
      .catch(function(error) {
         console.log('FAILED...', error);
         // Use SweetAlert for error message
         swal({
            title: "Failed!",
            text: "Failed to send the message, please try again.",
            icon: "error",
          });
      });
    });
  } else {
    console.log('Form not found');
  }
});





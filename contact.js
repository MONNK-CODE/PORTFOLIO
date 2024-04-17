// document.addEventListener('DOMContentLoaded', function() {
//   var form = document.getElementById('contactForm');
//   if (form) {
//     form.addEventListener('submit', function(event) {
//       event.preventDefault();

//       //This Extracts the data from the user in the form 
//       var firstName = document.querySelector('[name="first_name"]').value;
//       var lastName = document.querySelector('[name="last_name"]').value;
//       var emailAddress = document.querySelector('[name="email"]').value;
//       var message = document.querySelector('[name="message"]').value;

//       // this Sends email using EmailJS API
//       emailjs.send("", "", { // Service ID and Template ID
//           "firstName": firstName,
//           "lastName": lastName,
//           "emailAddress": emailAddress,
//           "message": message,
//       })
//       .then(function(response) {
//          console.log('SUCCESS!', response.status, response.text);
//          // USING SweetAlert for success message
//          swal({
//             title: "Success!",
//             text: "Your message has been sent successfully!",
//             icon: "success",
//           });
//          form.reset(); //this resets the input fields
//       }, function(error) {
//          console.log('FAILED...', error);
//          // Use SweetAlert for error message
//          swal({
//             title: "Failed!",
//             text: "Failed to send the message, please try again.",
//             icon: "error",
//           });
//       });
//     });
//   } else {
//     console.log('Form not found');
//   }
// });



document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Extract the data from the form
      var Name = document.querySelector('[name="first_name"]').value;
      var emailAddress = document.querySelector('[name="email_address"]').value;

      console.log("Name:", Name);
      console.log("Email Address:", emailAddress);

      // Send email using EmailJS
      emailjs.send(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, { 
          "emailAddress": emailAddress,  
          "Name": Name,      
       }, process.env.EMAILJS_PUBLIC_KEY)
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
         alert('Your message has been sent successfully!');
         // This Reset the form
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


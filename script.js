// document.addEventListener("DOMContentLoaded", function() {
//   let ld = document.querySelector(".ld");
//   let discord = document.querySelector(".discord");
//   let email = document.querySelector(".email");
//   let git = document.querySelector(".git");
//   let contact = document.querySelector(".contact");
//   let icons = document.querySelector(".icons");

//   contact.addEventListener("click", function() {
//     console.log("onclick");
//     // ld.style.display = "block";
//     // discord.style.display = "block";
//     // email.style.display = "block";
//     // git.style.display = "block";
//     icons.style.display = "block";
//   });
// });

document.addEventListener("DOMContentLoaded", function() {
  var contactButton = document.querySelector(".contact");
  var icons = document.querySelectorAll(".icons a i");

  contactButton.addEventListener("click", function() {
    // Toggle the visibility of each icon
    icons.forEach(function(icon) {
      icon.classList.toggle("show");
    });
  });
});



function downloadResume() {
  var link = document.createElement('a');
  link.href = 'RESUME 2023.pdf';
  link.download = 'RESUME 2023.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function openLink(url) {
    window.open(url, '_blank');
}



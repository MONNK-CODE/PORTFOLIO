document.addEventListener("DOMContentLoaded", function() {


const nav = document.querySelector("nav"),
toggleBtn = nav.querySelector(".toggle-btn");
  toggleBtn.addEventListener("click" , () =>{
    nav.classList.toggle("open");
  });
// js code to make draggable nav
function onDrag({movementY}) { //movementY gets mouse vertical value
  const navStyle = window.getComputedStyle(nav), //getting all css style of nav
        navTop = parseInt(navStyle.top), // getting nav top value & convert it into string
        navHeight = parseInt(navStyle.height), // getting nav height value & convert it into string
        windHeight = window.innerHeight; // getting window height
  nav.style.top = navTop > 0 ? `${navTop + movementY}px` : "1px";
  if(navTop > windHeight - navHeight){
    nav.style.top = `${windHeight - navHeight}px`;
  }
}
//this function will call when user click mouse's button and  move mouse on nav
nav.addEventListener("mousedown", () =>{
  nav.addEventListener("mousemove", onDrag);
});
//these function will call when user relase mouse button and leave mouse from nav

nav.addEventListener("mouseup", () =>{
  nav.removeEventListener("mousemove", onDrag);
});
nav.addEventListener("mouseleave", () =>{
  nav.removeEventListener("mousemove", onDrag);
});
  });


document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const sectionToScroll = urlParams.get('scrollTo');

  if (sectionToScroll) {
    const target = document.getElementById(sectionToScroll);
    if (target) {
      // Timeout to ensure the page is fully loaded before scrolling
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
        // Reset the URL parameter
        const urlWithoutParams = window.location.origin + window.location.pathname;
        history.replaceState({}, document.title, urlWithoutParams);
      }, 100); // You can adjust the timeout as needed
    }
  }
});




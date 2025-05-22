document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");
  const toggleBtn = nav.querySelector(".toggle-btn");
  const menuIcon = document.getElementById("menu-icon");

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("open");

    // Toggle between hamburger and X icon
    if (nav.classList.contains("open")) {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-times");
    } else {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    }
  });

  // Scroll to section functionality
  const urlParams = new URLSearchParams(window.location.search);
  const sectionToScroll = urlParams.get('scrollTo');

  if (sectionToScroll) {
    const target = document.getElementById(sectionToScroll);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
        const urlWithoutParams = window.location.origin + window.location.pathname;
        history.replaceState({}, document.title, urlWithoutParams);
      }, 100);
    }
  }





});
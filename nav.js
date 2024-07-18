document.addEventListener("DOMContentLoaded", function() {
  const nav = document.querySelector("nav");
  const toggleBtn = nav.querySelector(".toggle-btn");

  // Toggle navigation open/close
  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // Draggable navigation functionality
  function onDrag({movementY}) {
    const navStyle = window.getComputedStyle(nav);
    const navTop = parseInt(navStyle.top);
    const navHeight = parseInt(navStyle.height);
    const windHeight = window.innerHeight;

    nav.style.top = navTop > 0 ? `${navTop + movementY}px` : "1px";
    if(navTop > windHeight - navHeight){
      nav.style.top = `${windHeight - navHeight}px`;
    }
  }

  nav.addEventListener("mousedown", () => {
    nav.addEventListener("mousemove", onDrag);
  });

  nav.addEventListener("mouseup", () => {
    nav.removeEventListener("mousemove", onDrag);
  });

  nav.addEventListener("mouseleave", () => {
    nav.removeEventListener("mousemove", onDrag);
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
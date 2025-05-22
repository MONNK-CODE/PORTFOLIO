const TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    const that = this;
    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    const elements = document.getElementsByClassName('typewrite');
    for (let i=0; i<elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-type');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
}

 


document.addEventListener("DOMContentLoaded", function() {
    const dynamicText = document.querySelector("h1 span");
    const words = ["a Student", "Learning", "the Future"];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        dynamicText.textContent = currentWord.substring(0, charIndex);
        dynamicText.classList.add("stop-blinking");

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(typeEffect, 100);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, 50);
        } else {
            isDeleting = !isDeleting;
            dynamicText.classList.remove("stop-blinking");
            wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
            setTimeout(typeEffect, 1200);
        }
    }

    typeEffect();
});



// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});



// NAME ANIMATION
document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth <= 768) {
    const theLetters = "abcdefghijklmnopqrstuvwxyz#%&^+=-";
    const ctnt = "Muhais Olatundun";
    const speed = 50;
    const increment = 8;

    let clen = ctnt.length;
    let si = 0;
    let stri = 0;
    let block = "";
    let fixed = "";

    (function rustle(i) {
    setTimeout(function () {
    if (--i) rustle(i);
    nextFrame(i);
    si = si + 1;
}, speed);
})(clen * increment + 1);

    function nextFrame(pos) {
    for (let i = 0; i < clen - stri; i++) {
    let num = Math.floor(theLetters.length * Math.random());
    let letter = theLetters.charAt(num);
    block += letter;
}
    if (si === (increment - 1)) stri++;
    if (si === increment) {
    fixed += ctnt.charAt(stri - 1);
    si = 0;
}
    document.getElementById("mobile-name-output").innerHTML = fixed + block;
    block = "";
}
}
});

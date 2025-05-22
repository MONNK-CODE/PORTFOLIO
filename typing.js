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
    // Only run this on mobile screens
    if (window.innerWidth <= 768) {
        const characterPool = "abcdefghijklmnopqrstuvwxyz#%&^+=-";
        const finalText = "Muhais Olatundun";
        const frameDelay = 50; // milliseconds per frame
        const framesPerLetter = 8;

        const totalLetters = finalText.length;
        let currentFrame = 0;
        let revealedLetters = 0;
        let randomLetters = "";
        let revealedText = "";

        // Recursive function to animate each frame
        (function animateLetters(frameCount) {
            setTimeout(function () {
                if (--frameCount) animateLetters(frameCount);
                renderFrame(frameCount);
                currentFrame++;
            }, frameDelay);
        })(totalLetters * framesPerLetter + 1);

        function renderFrame(position) {
            // Create random characters for unrevealed part
            for (let i = 0; i < totalLetters - revealedLetters; i++) {
                const randomIndex = Math.floor(characterPool.length * Math.random());
                const randomChar = characterPool.charAt(randomIndex);
                randomLetters += randomChar;
            }

            // Reveal next letter after specific number of frames
            if (currentFrame === (framesPerLetter - 1)) revealedLetters++;
            if (currentFrame === framesPerLetter) {
                revealedText += finalText.charAt(revealedLetters - 1);
                currentFrame = 0;
            }

            document.getElementById("mobile-name-output").innerHTML = revealedText + randomLetters;
            randomLetters = ""; // reset for next frame
        }
    }
});

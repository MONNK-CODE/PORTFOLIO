 // Updated JavaScript with anime links removed
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageBars();
});

function initializeLanguageBars() {
    // Animate language proficiency bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const proficiencyBars = entry.target.querySelectorAll('.proficiency-fill');
                proficiencyBars.forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.5 });

    const languagesSection = document.querySelector('.languages-section');
    if (languagesSection) {
        observer.observe(languagesSection);
    }
}


// TYPING EFFECT
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
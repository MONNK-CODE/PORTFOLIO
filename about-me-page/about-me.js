document.addEventListener("DOMContentLoaded", () => {
    initializeLanguageBars();
    initializeAboutStory();
});


/* ===================================================
   LANGUAGE PROFICIENCY BARS
=================================================== */

function initializeLanguageBars() {

    const languagesSection = document.querySelector(".languages-section");

    if (!languagesSection) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target
                    .querySelectorAll(".proficiency-fill")
                    .forEach((bar) => {

                        const level = bar.getAttribute("data-level");

                        bar.style.width = "0%";

                        setTimeout(() => {
                            bar.style.width = `${level}%`;
                        }, 200);

                    });

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.5
        }
    );

    observer.observe(languagesSection);
}


/* ===================================================
   INTERACTIVE ABOUT STORY
=================================================== */

function initializeAboutStory() {

    const panels = document.querySelectorAll(".story-panel");

    if (!panels.length) {
        return;
    }


    /* ------------------------------------------------
       Reveal each story section as you scroll
    ------------------------------------------------ */

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                }

            });

        },
        {
            threshold: 0.22,
            rootMargin: "0px 0px -8% 0px"
        }
    );


    panels.forEach((panel) => {

        observer.observe(panel);

    });


    /* ------------------------------------------------
       Only use image tilt on devices with a mouse
    ------------------------------------------------ */

    const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;


    if (!canHover) {
        return;
    }


    /* ------------------------------------------------
       Subtle interactive image movement
    ------------------------------------------------ */

    document
        .querySelectorAll(".story-panel-media")
        .forEach((card) => {

            card.addEventListener("mousemove", (event) => {

                const rect = card.getBoundingClientRect();


                /* Mouse position from -0.5 to 0.5 */

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;


                /* Tilt image card */

                card.style.transform =
                    `
                    perspective(1000px)
                    rotateX(${y * -3}deg)
                    rotateY(${x * 3}deg)
                    `;

            });


            /* Reset when mouse leaves */

            card.addEventListener("mouseleave", () => {

                card.style.transform =
                    `
                    perspective(1000px)
                    rotateX(0deg)
                    rotateY(0deg)
                    `;

            });

        });

}
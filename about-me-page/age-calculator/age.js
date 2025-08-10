const birthDate = new Date('2006-07-21T00:00:00');

const ageElement = document.getElementById('age-counter');

const MS_IN_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Calculates the current age and updates the display.
 */
function updateAge() {

    const now = new Date();

    const ageInMs = now.getTime() - birthDate.getTime();


    const ageInYears = ageInMs / MS_IN_YEAR;


    ageElement.textContent = ageInYears.toFixed(9) + ' years old';
}


setInterval(updateAge, 50);

updateAge();
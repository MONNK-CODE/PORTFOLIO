document.addEventListener('DOMContentLoaded', () => {
    //Replace this with your own Monkeytype User ID
    const userId = 'monnk';

    // API endpoint
    const apiUrl = `https://api.monkeytype.com/users/${userId}/profile`;

    const wpm30Elem = document.getElementById('wpm-30');
    const acc30Elem = document.getElementById('acc-30');
    const consistency30Elem = document.getElementById('consistency-30');
    const errorElem = document.getElementById('error-message');
    const gridElem = document.getElementById('stats-grid');

    function displayError(message) {
        errorElem.textContent = message;
        errorElem.style.display = 'block';
        gridElem.style.display = 'none';
    }

    if (userId === 'YOUR_USER_ID_HERE') {
        displayError('Error: Please set your Monkeytype User ID in the script.');
        return;
    }

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (Status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.data || !data.data.personalBests) {
                throw new Error('Invalid data format received from API.');
            }

            const personalBests = data.data.personalBests.time;

            // Get the best test for 30 seconds
            const best30 = personalBests['30']?.[0];

            if (!best30) {
                throw new Error('No 30-second test data found for this user.');
            }

            // Update HTML elements with the 30-second stats
            wpm30Elem.innerHTML = `${Math.round(best30.wpm)}`;
            acc30Elem.innerHTML = `${best30.acc.toFixed(1)}<span class="unit">%</span>`;
            consistency30Elem.innerHTML = `${best30.consistency.toFixed(1)}<span class="unit">%</span>`;

        })
        .catch(error => {
            console.error('Fetch Error:', error);
            displayError(`Could not load stats. ${error.message}`);
        });
});
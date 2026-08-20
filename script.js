document.addEventListener('DOMContentLoaded', function() {
  // Function to scroll to an element
  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Check URL parameters when page loads
  const urlParams = new URLSearchParams(window.location.search);
  const scrollTo = urlParams.get('scrollTo');
  if (scrollTo) {
    scrollToElement(scrollTo);
  }

// QUOTE GENERATOR
  const quotes = [
    "Your future is built in the quiet hours no one applauds.",
    "Discomfort is the tuition you pay for growth.",
    "When you can’t see the whole path, take the step that’s in front of you.",
    "To conquer frustration, one must remain intensely focused on the outcome, not the obstacles.",
    "If you are curious, you'll find the puzzles around you. If you are determined, you will solve them.",
    "Have the courage to make up your mind and hold your decisions.",
    "Practice makes perfect. After a long time of practicing, our work will become natural, skillful, swift, and steady.",
    "Stay afraid, but do it anyway. What’s important is the action. You don’t have to wait to be confident. Just do it, and eventually the confidence will follow.",
    "It’s not about the number of hours you practice, it’s about the number of hours your mind is present during the practice.",
    "You don’t need to know what happens next. You just need to be ready for the heat."
  ];

  function typeEffect(text, elementId, speed = 50) {
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    let i = 0;

    function typing() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      }
    }

    typing();
  }

  window.onload = function () {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    typeEffect(randomQuote, 'quoteDisplay', 40); // You can adjust speed here
  };
  // QUOTE GENERATOR END
});




// VISITOR COUNTER
document.addEventListener("DOMContentLoaded", function () {
  const workspace = "muhais-olatunduns-team-2519";
  const counterName = "first-counter-2519";

  // IMPORTANT: replace this after rotating your exposed token
  const apiToken = "ut_0w0POvoh0DEjrG1tjvjcumXjlu2cgnlciN7sMUdw";

  const counterElement = document.getElementById("visitor-count");

  if (!counterElement) {
    console.error("Visitor counter element not found.");
    return;
  }

  fetch(
      `https://api.counterapi.dev/v2/${workspace}/${counterName}/up`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`
        }
      }
  )
      .then(async response => {
        const data = await response.json();

        if (!response.ok) {
          console.error("CounterAPI response:", data);
          throw new Error(`CounterAPI error: ${response.status}`);
        }

        return data;
      })
      .then(data => {
        console.log("CounterAPI success:", data);

        if (typeof data?.data?.up_count === "number") {
          counterElement.textContent = data.data.up_count;
        } else {
          throw new Error("Unexpected CounterAPI response");
        }
      })
      .catch(error => {
        console.error("Counter Error:", error);
        counterElement.textContent = "—";
      });
});
// // VISITOR COUNTER
// function displayCount(count) {
//   const counterElement = document.getElementById("visitor-count");
//
//   if (counterElement && typeof count === "number") {
//     counterElement.innerText = count;
//   }
// }
//
// // COUNTERAPI V2
// const workspace = "muhais-olatunduns-team-2519";
// const counterName = "first-counter-2519";
// const apiToken = "ut_0w0POvoh0DEjrG1tjvjcumXjlu2cgnlciN7sMUdw";
//
// fetch(
//     `https://api.counterapi.dev/v2/${workspace}/${counterName}/up`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${apiToken}`
//       }
//     }
// )
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`CounterAPI error: ${response.status}`);
//       }
//
//       return response.json();
//     })
//     .then(data => {
//       console.log("CounterAPI response:", data);
//
//       displayCount(data.data.up_count);
//     })
//     .catch(error => {
//       console.error("Counter Error:", error);
//
//       const counterElement = document.getElementById("visitor-count");
//
//       if (counterElement) {
//         counterElement.innerText = "1";
//       }
//     });

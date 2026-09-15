// Change sections
function hideAllSections() {

    document.getElementById("welcome").style.display = "none";

    document.getElementById("planning").style.display = "none";

    document.getElementById("review").style.display = "none";

    document.getElementById("success").style.display = "none";
}


// Start planning
function startPlan() {

    hideAllSections();

    document.getElementById("planning").style.display = "block";
}


// Show review
function showReview() {

    // Get values
    const name = document.getElementById("name").value.trim();

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    const place = document.getElementById("place").value;


    // Check all fields
    if (
        name === "" ||
        date === "" ||
        time === "" ||
        place === ""
    ) {

        alert(
            "Please enter your name and choose the date, time and place 💗"
        );

        return;
    }


    // Format date
    const dateObject = new Date(date + "T00:00:00");

    const formattedDate = dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );


    // Format time
    const timeObject = new Date("2000-01-01T" + time);

    const formattedTime = timeObject.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );


    // Display name in review
    document.getElementById("reviewName").textContent =
        name;


    // Display date in review
    document.getElementById("reviewDate").textContent =
        formattedDate;


    // Display time in review
    document.getElementById("reviewTime").textContent =
        formattedTime;


    // Display place in review
    document.getElementById("reviewPlace").textContent =
        place;


    // Show review section
    hideAllSections();

    document.getElementById("review").style.display = "block";

}


// Go back to planning
function backToPlanning() {

    hideAllSections();

    document.getElementById("planning").style.display = "block";

}


// Confirm meetup
async function confirmMeetup() {

    // Get values
    const name = document.getElementById("name").value.trim();

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    const place = document.getElementById("place").value;


    // Check all fields again
    if (
        name === "" ||
        date === "" ||
        time === "" ||
        place === ""
    ) {

        alert(
            "Please enter your name and choose the date, time and place 💗"
        );

        return;
    }


    try {

        // Send data to backend
        const response = await fetch("/api/meetup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: name,

                date: date,

                time: time,

                place: place

            })

        });


        const data = await response.json();


        // Check server response
        if (!response.ok) {

            alert(
                data.message ||
                "Something went wrong 😢"
            );

            return;

        }


        // Format date
        const dateObject = new Date(date + "T00:00:00");

        const formattedDate = dateObject.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


        // Format time
        const timeObject = new Date("2000-01-01T" + time);

        const formattedTime = timeObject.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        );


        // Display final name
        document.getElementById("finalName").textContent =
            "👤 " + name;


        // Display final date
        document.getElementById("finalDate").textContent =
            "📅 " + formattedDate;


        // Display final time
        document.getElementById("finalTime").textContent =
            "🕐 " + formattedTime;


        // Display final place
        document.getElementById("finalPlace").textContent =
            "📍 " + place;


        // Show success section
        hideAllSections();

        document.getElementById("success").style.display = "block";


        // Create confetti
        createConfetti();


    } catch (error) {

        console.error("Error:", error);

        alert(
            "Unable to connect to the server. " +
            "Please try again later."
        );

    }

}


// Confetti
function createConfetti() {

    const emojis = [
        "🎉",
        "💕",
        "💗",
        "✨",
        "💖",
        "🎊"
    ];


    for (let i = 0; i < 30; i++) {

        const confetti = document.createElement("div");

        confetti.classList.add("confetti");

        confetti.textContent =
            emojis[
                Math.floor(
                    Math.random() * emojis.length
                )
            ];


        confetti.style.left =
            Math.random() * 100 + "vw";


        confetti.style.animationDuration =
            (2 + Math.random() * 2) + "s";


        document.body.appendChild(confetti);


        setTimeout(() => {

            confetti.remove();

        }, 4000);

    }

}
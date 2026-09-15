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

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    const place = document.getElementById("place").value;


    if (date === "" || time === "" || place === "") {

        alert("Please choose the date, time and place 💗");

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


    // Display review
    document.getElementById("reviewDate").textContent =
        formattedDate;

    document.getElementById("reviewTime").textContent =
        formattedTime;

    document.getElementById("reviewPlace").textContent =
        place;


    hideAllSections();

    document.getElementById("review").style.display = "block";

}


// Go back
function backToPlanning() {

    hideAllSections();

    document.getElementById("planning").style.display = "block";

}


// Confirm meetup
async function confirmMeetup() {

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    const place = document.getElementById("place").value;


    try {

        const response = await fetch("/api/meetup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                date: date,
                time: time,
                place: place
            })

        });


        const data = await response.json();


        if (!response.ok) {

            alert(data.message || "Something went wrong 😢");

            return;

        }


        // Final date
        const dateObject = new Date(date + "T00:00:00");

        const formattedDate = dateObject.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


        // Final time
        const timeObject = new Date("2000-01-01T" + time);

        const formattedTime = timeObject.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        );


        document.getElementById("finalDate").textContent =
            "📅 " + formattedDate;

        document.getElementById("finalTime").textContent =
            "🕐 " + formattedTime;

        document.getElementById("finalPlace").textContent =
            "📍 " + place;


        hideAllSections();

        document.getElementById("success").style.display = "block";


        createConfetti();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server. " +
            "Please make sure the backend is running."
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
            emojis[Math.floor(Math.random() * emojis.length)];


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
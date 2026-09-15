const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


// ===============================
// CHECK ENVIRONMENT VARIABLES
// ===============================

if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing in .env file");
    process.exit(1);
}

if (!process.env.EMAIL_USER) {
    console.error("❌ EMAIL_USER is missing in .env file");
    process.exit(1);
}

if (!process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_PASS is missing in .env file");
    process.exit(1);
}

if (!process.env.NOTIFY_EMAIL) {
    console.error("❌ NOTIFY_EMAIL is missing in .env file");
    process.exit(1);
}


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// ===============================
// MONGODB SCHEMA
// ===============================

const meetupSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    place: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


// ===============================
// MONGODB MODEL
// ===============================

const Meetup = mongoose.model(
    "Meetup",
    meetupSchema
);


// ===============================
// EMAIL TRANSPORTER
// ===============================

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});


// ===============================
// HOME PAGE
// ===============================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// ===============================
// CONFIRM MEETUP
// ===============================

app.post("/api/meetup", async (req, res) => {

    try {

        const {
            name,
            date,
            time,
            place
        } = req.body;


        // Check required fields

        if (
            !name ||
            !date ||
            !time ||
            !place
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, date, time and place are required."

            });

        }


        // ===============================
        // SAVE MEETUP TO MONGODB
        // ===============================

        const meetup = new Meetup({

            name: name,

            date: date,

            time: time,

            place: place

        });


        await meetup.save();


        console.log(
            `💗 New meetup confirmed by ${name}`
        );


        // ===============================
        // SEND EMAIL NOTIFICATION
        // ===============================

        try {

            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: process.env.NOTIFY_EMAIL,

                subject:
                    "💌 New Meetup Confirmed!",

                text: `
A new meetup has been confirmed!

👤 Name: ${name}

📅 Date: ${date}

🕐 Time: ${time}

📍 Place: ${place}

This notification was sent automatically by your Meetup website.
                `

            });


            console.log(
                "📩 Notification email sent successfully"
            );

        } catch (emailError) {

            console.error(
                "❌ Email notification failed:",
                emailError.message
            );

        }


        // ===============================
        // SEND RESPONSE TO FRONTEND
        // ===============================

        res.status(201).json({

            success: true,

            message:
                "Meetup confirmed successfully! 💗",

            meetup: meetup

        });


    } catch (error) {

        console.error(
            "❌ Error saving meetup:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to save meetup."

        });

    }

});


// ===============================
// GET ALL MEETUPS
// ===============================

app.get("/api/meetups", async (req, res) => {

    try {

        const meetups =
            await Meetup
                .find()
                .sort({
                    createdAt: -1
                });


        res.json(meetups);


    } catch (error) {

        console.error(
            "❌ Error getting meetups:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to get meetups."

        });

    }

});


// ===============================
// CONNECT MONGODB
// ===============================

console.log(
    "Connecting to MongoDB..."
);


mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected successfully ✅"
        );


        app.listen(

            PORT,

            "0.0.0.0",

            () => {

                console.log(
                    `Server running at http://localhost:${PORT}`
                );

            }

        );

    })

    .catch((error) => {

        console.error(
            "❌ MongoDB connection failed"
        );

        console.error(
            "Error:",
            error.message
        );

    });
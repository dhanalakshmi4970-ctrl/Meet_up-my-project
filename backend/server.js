const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();


// Create Express app
const app = express();


// Port
const PORT = process.env.PORT || 5000;


// Check MongoDB connection string
if (!process.env.MONGO_URI) {

    console.error("❌ MONGO_URI is missing in .env file");

    process.exit(1);
}


// Middleware
app.use(express.json());


// Serve frontend
app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// ===============================
// Meetup Schema
// ===============================

const meetupSchema = new mongoose.Schema({

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


const Meetup = mongoose.model(
    "Meetup",
    meetupSchema
);


// ===============================
// Home Page
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
// Save Meetup
// ===============================

app.post("/api/meetup", async (req, res) => {

    try {

        const {
            date,
            time,
            place
        } = req.body;


        // Check required fields
        if (!date || !time || !place) {

            return res.status(400).json({

                success: false,

                message:
                    "Date, time and place are required."

            });

        }


        // Create meetup
        const meetup = new Meetup({

            date: date,

            time: time,

            place: place

        });


        // Save to MongoDB
        await meetup.save();


        // Send response
        res.status(201).json({

            success: true,

            message:
                "Meetup confirmed successfully! 💗",

            meetup: meetup

        });


    } catch (error) {

        console.error(
            "Error saving meetup:",
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
// Get All Meetups
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
            "Error getting meetups:",
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
// MongoDB Connection
// ===============================

console.log("Connecting to MongoDB...");


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log(
            "MongoDB connected successfully ✅"
        );


       app.listen(PORT, "0.0.0.0", () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

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
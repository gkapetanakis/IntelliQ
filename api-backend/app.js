"use strict"; // strict mode to reduce errors

// load environmental variables from the .env file
// if not in a production environment
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    console.log("Loaded the .env variables")
}

// import my modules
const functionalityRouter = require("./routes/functional");
const adminRouter = require("./routes/admin");

// import other modules
const express = require("express");
const mongoose = require("mongoose");

// configure the express app
const app = express();
app.use(process.env.BASE_URL, functionalityRouter);
app.use(process.env.BASE_URL + "/admin", adminRouter);

// connect to the database
mongoose
    .connect(process.env.DATABASE_URL)
    .then(console.log("Connected to the database"))
    .catch(error => console.error("Couldn't connect to the database:", error));
mongoose.connection.on("error", error => console.error("Database connection error:", error)); // add error listener
mongoose.connection.on("disconnected", message => console.log("Database disconnected:", message)); // add disconnection listener

// start the express app
app.listen(process.env.PORT, console.log("App is now listening on port", process.env.PORT));

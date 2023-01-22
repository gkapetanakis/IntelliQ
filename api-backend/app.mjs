"use strict"; // strict mode to reduce errors

// import third party modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// import this package's modules
import adminRouter from "./routes/admin.mjs";
import functionalityRouter from "./routes/functionality.mjs";

// load environmental variables from the .env file
// if not in a production environment
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
    console.log("Loaded the .env variables")
}

// constants
const APP_HOST = process.env.APP_HOST;
const APP_PORT = process.env.APP_PORT;
const APP_BASE_URL = process.env.APP_BASE_URL;
const DATABASE_URL = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

// connect to the database
mongoose.connect(DATABASE_URL);
mongoose.connection.on("error", (error) => console.error("Database connection error:", error)); // add error event listener
mongoose.connection.on("connected", () => console.log("Connected to database")); // add connection event listener
mongoose.connection.on("disconnected", () => console.log("Disconnected from database")); // add disconnection event listener

// configure the express app
const app = express();
app.use(`${APP_BASE_URL}/admin`, adminRouter); // set up admin endpoints
app.use(APP_BASE_URL, functionalityRouter); // set up functionality endpoints

// start the express app
app.listen(APP_PORT, APP_HOST, console.log("App is now listening on port", APP_PORT));

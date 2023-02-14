// import third party modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// import this package's modules
import adminRouter from "./routes/admin.mjs";
import functionalityRouter from "./routes/functionality.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

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

// connect to the database asynchronously
const mongooseOptions = {
    serverSelectionTimeoutMS: 5000 // retry requests for up to 5 seconds
};
(async () => {
    try {
        await mongoose.connect(DATABASE_URL, mongooseOptions);
    } catch {
        console.error("Mongoose failed to connect");
    }
})();

mongoose.connection.on("error", (error) => console.error("Database connection error:\n", error)); // add error event listener
mongoose.connection.on("connected", () => console.log("Connected to database")); // add connection event listener
mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from database");
    (async () => {
        try {
            await mongoose.connect(DATABASE_URL, mongooseOptions);
        } catch {
            console.error("Mongoose failed to connect");
        }
    })();
}); // add disconnection event listener

// create and configure the express app
const app = express();
app.use((req, res, next) => { // first middleware in the chain - just logs something
    console.log("------------------------------\n");
    res.locals.step = 1;
    console.log(req.url);
    console.log(`${res.locals.step++}. Endpoint controller executing`);

    next();
});
app.use(`${APP_BASE_URL}/admin`, adminRouter); // set up admin endpoints
app.use(APP_BASE_URL, functionalityRouter); // set up functionality endpoints
app.use(errorHandler); // set up error handling middleware
app.use((req, res) => { // last middleware in the chain - just sends the response
    console.log(`${res.locals.step++}. Final middleware executing; sending response\n`);

    const responseObj = res.locals?.responseObj;
    const format = req.query?.format || "json";

    if (!responseObj) // no content
        res.send();
    else if (format === "csv") // csv
        res.send(responseObj);
    else // json
        res.json(responseObj);
});

// start the express app
app.listen(APP_PORT, APP_HOST, console.log("App is now listening on port", APP_PORT));

export {
    APP_HOST,
    APP_PORT,
    APP_BASE_URL,
    DATABASE_URL
};

/*
    middleware order:
        - first middleware (always runs, just logs something)
        - route controller (always runs)
        - query handler (if applicable)
        - format handler (if applicable)
        - error handler (if at any point an error occurs)
        - final middleware (always runs, just sends the response)
*/

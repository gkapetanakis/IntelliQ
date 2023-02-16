// import third party modules
import express from "express";
import mongoose from "mongoose";

// import this package's modules
import adminRouter from "./routes/admin.mjs";
import functionalityRouter from "./routes/functionality.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

// load environmental variables from the .env file
// if not in a production environment
if (process.env.NODE_ENV !== "production") {
    const dotenv = await import("dotenv");
    dotenv.config();
    console.log("Loaded the .env variables")
}

// constants
const APP_HOST = process.env.APP_HOST;
const APP_PORT = process.env.APP_PORT;
const APP_BASE_URL = process.env.APP_BASE_URL;
const DATABASE_URL = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

// add event listeners to database connection
mongoose.connection.on("error", (error) => console.error("Database connection error:\n", error));
mongoose.connection.on("connected", () => console.log("Connected to database"));
mongoose.connection.on("disconnected", async () => {
    console.log("Disconnected from database");
    await connectToDB();
});

// connect to the database
await connectToDB();

// create and configure the express app
const app = express();
app.use(firstMiddleware);
app.use(`${APP_BASE_URL}/admin`, adminRouter); // set up admin endpoints
app.use(APP_BASE_URL, functionalityRouter); // set up functionality endpoints
app.use(errorHandler); // set up error handling middleware
app.use(lastMiddleware);

// start the express app
app.listen(APP_PORT, APP_HOST, console.log("App is now listening on port", APP_PORT));

// function to connect to the database asynchronously
async function connectToDB() {
    try {
        await mongoose.connect(DATABASE_URL, {
            serverSelectionTimeoutMS: 5000 // retry requests for up to 5 seconds
        });
    } catch {
        console.error("Mongoose failed to connect");
    }
};

// first middleware in the chain - just logs something
function firstMiddleware(req, res, next) {
    console.log("------------------------------\n");
    res.locals.step = 1;

    console.log(req.url);
    console.log(`${res.locals.step++}. Endpoint controller executing`);

    next();
}

// last middleware in the chain - just sends the response
function lastMiddleware(req, res) {
    console.log(`${res.locals.step++}. Final middleware executing; sending response\n`);

    const responseObj = res.locals?.responseObj;
    const format = req.query?.format || "json";

    if (!responseObj) // no content
        res.send();
    else if (format === "csv") // csv
        res.send(responseObj);
    else // json
        res.json(responseObj);
}

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

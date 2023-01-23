// this module contains all the administrative controllers

// import third party modules
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

// check database connectivity
function getHealthcheck(req, res) {
    const statusCode = StatusCodes.OK;
    const db = mongoose.connection;
    // reasyState is equal to 1 if connection to database is healthy
    const response = {
        status: db.readyState === 1 ? "OK" : "failed",
        dbconnection: `mongodb://${db.host}:${db.port}/${db.name}`
    };
    res.status(statusCode).json(response);
}

// upload a questionnaire to the database
async function postQuestionnaireUpd(req, res) {
    let statusCode = StatusCodes.NO_CONTENT;
    let reasonValue = undefined;
    let response = undefined;

    // turn the uploaded document into a JSON object
    // req.file.buffer contains the uploaded file data as bytes
    // toString() is required to make it readable
    // JSON.parse() turns a JSON string into a proper JSON object
    const jsonified = JSON.parse(req.file.buffer.toString());
    // create a questionnaire with the given values
    const questionnaire = new Questionnaire(jsonified);

    // save the questionnaire
    const { success } = await saveDocument(questionnaire);
    if (!success) {
        console.log(error);
        statusCode = StatusCodes.BAD_REQUEST;
        reasonValue = "Bad questionnaire parameters"; // When proper validation is added, this will become more specific
        response = { error: reasonValue };
    }
    res.status(statusCode).send(response);

    // helper functions --------------------

    async function saveDocument(document) {
        try {
            await document.save();
            console.log("A new questionnaire was saved to the database");
            return { success: true };
        } catch (error) {
            console.log("Failed to save a new questionnaire to the database:", error);
            return { success: false };
        }
    }
}

// delete all documents form the database
function postResetAll(req, res) {
    // TODO
}

// delete all sessions of a given questionnaire
function postResetQ(req, res) {
    // TODO
}

export { getHealthcheck, postQuestionnaireUpd, postResetAll, postResetQ };

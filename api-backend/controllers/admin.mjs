// this module contains all the administrative controllers

// import third party modules
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

// import this package's modules
import { DATABASE_URL } from "../app.mjs";
import Questionnaire from "../models/questionnaire.mjs";
import Answer from "../models/answer.mjs";
import { executeQuery, createDocument } from "../lib/dbUtils.mjs";
import { handleQueryResponse, handleCreateResponse, documentExists } from "../lib/apiUtils.mjs";

// check database connectivity
function getHealthcheck(_req, res) {
    // reasyState is equal to 1 if connection to database is healthy
    const response = {
        status: mongoose.connection.readyState === 1 ? "OK" : "failed",
        dbconnection: DATABASE_URL
    };
    res.status(StatusCodes.OK).json(response);
}

// upload a questionnaire to the database
async function postQuestionnaireUpd(req, res) {
    // turn the uploaded document into a JSON object:
    // req.file.buffer contains the uploaded file data as bytes
    // toString() is required to make it readable
    // JSON.parse() turns a json string into a proper json object
    const obj = JSON.parse(req.file.buffer.toString());

    // create a document and save it
    const status = handleCreateResponse(await createDocument(obj, Questionnaire));

    // send response
    res.status(status).send();
}

// delete all documents from the database
async function postResetAll(_req, res) {
    // create response
    const response = {
        status: "OK",
        reason: undefined
    };

    // delete all questionnaires
    const questionnaireQuery = Questionnaire.deleteMany();
    const questionnaireResult = handleQueryResponse(await executeQuery(questionnaireQuery));
    
    // delete all answers
    const answerQuery = Answer.deleteMany();
    const answerResult = handleQueryResponse(await executeQuery(answerQuery));

    // http codes greater than 299 indicate that somethinng went wrong
    if (questionnaireResult.status > 299 || answerResult.status > 299) {
        response.status = "failed";
        response.reason = "Internal server error:";
        if (questionnaireResult.status > 299)
            response.reason += " Failed to delete questionnaires.";
        if (answerResult.status > 299)
            response.reason += " Failed to delete answers.";
    }

    // send response
    res.status(response.status === "OK" ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR).json(response);
}

// delete all sessions of a given questionnaire
async function postResetQ(req, res) {
    const questionnaireID = req.params.questionnaireID;

    // create response
    const response = {
        status: "OK",
        reason: undefined
    };

    // verify questionnaire exists
    const query = Questionnaire
        .exists()
        .where({ "questionnaireID" : questionnaireID });
    const { ans, err } = await documentExists(query);

    if (err || !ans) {
        response.status = "failed";
        response.reason = (err) ? "Internal server error" : "No questionnaire exists with the given ID";
    } else {
        const query = Answer
            .deleteMany()
            .where({ "questionnaireID" : questionnaireID });
        const { status } = handleQueryResponse(await executeQuery(query));
        // http codes greater than 299 indicate that somethinng went wrong
        if (status > 299) {
            response.status = "failed";
            response.reason = "Internal server error";
        }
    }

    res.status(response.status === "OK" ? StatusCodes.NO_CONTENT : StatusCodes.INTERNAL_SERVER_ERROR).json(response);
}

export { getHealthcheck, postQuestionnaireUpd, postResetAll, postResetQ };

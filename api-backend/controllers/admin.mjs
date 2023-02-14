// this module contains all the administrative controllers

// import third party modules
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

// import this package's modules
import { DATABASE_URL } from "../app.mjs";
import Questionnaire from "../models/questionnaire.mjs";
import Answer from "../models/answer.mjs";

// check database connectivity
function getHealthcheck(_req, res, next) {
    res.status(StatusCodes.OK);
    res.locals.responseObj = {
        // readyState is equal to 1 if connection to database is healthy
        status: mongoose.connection.readyState === 1 ? "OK" : "failed",
        dbconnection: DATABASE_URL
    };
    next();
}

// upload a questionnaire to the database
async function postQuestionnaireUpd(req, res, next) {
    // turn the uploaded document into a JSON object:
    // req.file.buffer contains the uploaded file data as bytes
    // toString() is required to make it readable
    // JSON.parse() turns a json string into a proper json object
    try {
        // throws error if file does not exist
        res.locals.obj = JSON.parse(req.file.buffer.toString());
        res.locals.model = Questionnaire;
        res.status(StatusCodes.OK);
        next();
    } catch (err) {
        // file did not exist
        res.status(err instanceof TypeError || err instanceof mongoose.Error.ValidationError
            ? StatusCodes.BAD_REQUEST
            : StatusCodes.INTERNAL_SERVER_ERROR
        );
        next(err);
    }
}

// delete all documents from the database
// will delete questionnaires only if the answers are successfully deleted
// in order to not leave the database in an inconsistent state
async function postResetAll(_req, res, next) {
    res.status(StatusCodes.OK);
    res.locals.responseObj = { status: "OK" };

    try {
        await Answer.deleteMany();
    } catch {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.locals.responseObj = {
            status: "failed",
            reason: "Nor answers, neither questionnaires could be purged"
        };
        next();
        return;
    }

    try {
        await Questionnaire.deleteMany();
    } catch {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.locals.responseObj = {
            status: "failed",
            reason: "Answers purged; questionnaires could not be purged"
        };
    }

    // this endpoint handles its own errors,
    // therefore it never needs to call the error handler
    next();
}

// delete all sessions of a given questionnaire
async function postResetQ(req, res, next) {
    const questionnaireID = req.params.questionnaireID;
    res.status(StatusCodes.OK);
    res.locals.responseObj = { status: "OK" };

    try {
        const questionnaire = await Questionnaire
            .exists()
            .where({ "questionnaireID" : questionnaireID })
            .lean();

        if (!questionnaire) {
            res.status(StatusCodes.BAD_REQUEST);
            res.locals.responseObj = {
                status: "failed",
                reason: "Unable to find a questionnaire with the given ID"
            };
        } else {
            await Answer.deleteMany()
                .where({ "questionnaireID" : questionnaireID });
        }
    } catch {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.locals.responseObj = {
            status: "failed",
            reason: "Internal server error"
        };
    }
    
    // this endpoint handles its own errors,
    // therefore it never needs to call the error handler
    next();
}

export {
    getHealthcheck,
    postQuestionnaireUpd,
    postResetAll,
    postResetQ
};

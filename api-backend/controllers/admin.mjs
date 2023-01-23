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
function postQuestionnaireUpd(req, res) {
    // TODO
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

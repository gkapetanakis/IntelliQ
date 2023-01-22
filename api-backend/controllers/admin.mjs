// this module contains all the administrative controllers

// import third party modules
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

// check database connectivity
function getHealthcheck(req, res) {
    // TODO
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

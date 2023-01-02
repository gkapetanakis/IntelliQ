// this module contains all the functionality endpoints

const express = require("express");
const hsc = require("http-status-codes"); // quick way to access status codes
const router = express.Router();

// fetch a questionnaire from the database
router.get("/questionnaire/:questionnaireID", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});
 // fetch a question from the database
router.get("/question/:questionnaireID/:questionID", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});

// post an answer to the database
router.post("/doanswer/:questionnaireID/:questionID/:sessionID/:optionID", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});

// fetch a session from the database
router.get("/getsessionanswers/:questionnaireID/:sessionID", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});

// fetch all the answers to a question from the database
router.get("/getquestionanswers/:questionnaireID/:questionID", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});

module.exports = router;

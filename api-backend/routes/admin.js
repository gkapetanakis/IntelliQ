// this module contains all the administrative endpoints

const express = require("express");
const hsc = require("http-status-codes"); // quick way to access status codes
const router = express.Router();

// check the health of the connection to the database
router.get("/healthcheck", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});

// post a new questionnaire (as a JSON file)
router.post("/questionnaire_upd", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});

// delete everything in the database
router.post("/resetall", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});

// delete a questionnaire's answers
router.post("resetq/:questionnaireID", (req, res) => {
    res.status(hsc.StatusCodes.OK).send(hsc.ReasonPhrases.OK);
});

module.exports = router;

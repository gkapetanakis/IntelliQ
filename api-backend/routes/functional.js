const express = require("express");
const hsc = require("http-status-codes");
const router = express.Router();

router.get("/question/:questionnaireID/:questionID", (req, res) => {
    res.send(hsc.ReasonPhrases.OK);
});

router.post("/doanswer/:questionnaireID/:questionID/:session/:optionID", (req, res) => {
    res.send(hsc.ReasonPhrases.OK);
});

router.post("/getsessionanswers/:questionnaireID/:session", (req, res) => {
    res.send(hsc.ReasonPhrases.OK);
});

module.exports = router;

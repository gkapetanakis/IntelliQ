// this module contains all the functionality endpoints

// import third party modules
import express from "express";

// import this package's modules
import * as controller from "../controllers/functionality.mjs";
import { findQueryHandler, createQueryHandler } from "../middleware/queryHandler.mjs";
import formatHandler from "../middleware/formatHandler.mjs";

// create the router
const router = express.Router();

// endpoint to fetch a questionnaire from the database
router.get("/questionnaire/:questionnaireID", 
    controller.getQuestionnaire, [findQueryHandler, formatHandler]);

// endpoint to fetch a question from the database
router.get("/question/:questionnaireID/:questionID", 
    controller.getQuestion, [findQueryHandler, formatHandler]);

// endpoint to post an answer to the database, optionID may not exist in optional questions
router.post("/doanswer/:questionnaireID/:questionID/:sessionID/:optionID?", 
    controller.postDoAnswer, [createQueryHandler]);

// endpoint to fetch a session from the database
router.get("/getsessionanswers/:questionnaireID/:sessionID", 
    controller.getGetSessionAnswers, [findQueryHandler, formatHandler]);

// endpoint to fetch all the answers to a question from the database
router.get("/getquestionanswers/:questionnaireID/:questionID", 
    controller.getGetQuestionAnswers, [findQueryHandler, formatHandler]);

export default router;

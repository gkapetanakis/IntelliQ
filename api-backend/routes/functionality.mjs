// this module contains all the functionality endpoints

// import third party modules
import express from "express";

// import this package's modules
import * as controller from "../controllers/functionality.mjs";
import { findQueryHandler, createQueryHandler } from "../middleware/queryHandler.mjs";

// create the router
const router = express.Router();

// endpoint to fetch a questionnaire from the database
router.get("/questionnaire/:questionnaireID", controller.getQuestionnaire);

// endpoint to fetch a question from the database
router.get("/question/:questionnaireID/:questionID", controller.getQuestion);

// endpoint to post an answer to the database
router.post("/doanswer/:questionnaireID/:questionID/:sessionID/:optionID", controller.postDoAnswer, createQueryHandler);

// endpoint to fetch a session from the database
router.get("/getsessionanswers/:questionnaireID/:sessionID", controller.getGetSessionAnswers);

// endpoint to fetch all the answers to a question from the database
router.get("/getquestionanswers/:questionnaireID/:questionID", controller.getGetQuestionAnswers);

// all "GET" endpoints use this handler
router.get(/.*/, findQueryHandler);

export default router;

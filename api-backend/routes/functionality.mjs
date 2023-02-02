// this module contains all the functionality endpoints

// import third party modules
import express from "express";

// import this package's modules
import * as controller from "../controllers/functionality.mjs";

// import checking middleware
// import formatting middleware
import { checkParams, format } from "../controllers/queryParams.mjs";

// create the router
const router = express.Router();

// check parameters of requests
router.use(checkParams);

// endpoint to fetch a questionnaire from the database
router.get("/questionnaire/:questionnaireID", controller.getQuestionnaire, format);

// endpoint to fetch a question from the database
router.get("/question/:questionnaireID/:questionID", controller.getQuestion, format);

// endpoint to post an answer to the database
router.post("/doanswer/:questionnaireID/:questionID/:sessionID/:optionID", controller.postDoAnswer, format);

// endpoint to fetch a session from the database
router.get("/getsessionanswers/:questionnaireID/:sessionID", controller.getGetSessionAnswers, format);

// endpoint to fetch all the answers to a question from the database
router.get("/getquestionanswers/:questionnaireID/:questionID", controller.getGetQuestionAnswers, format);

export default router;

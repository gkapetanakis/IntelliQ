// this module contains all the functionality controllers

// import this package's modules
import Questionnaire from "../models/questionnaire.mjs";
import Answer from "../models/answer.mjs";

// fetch a questionnaire from the database
async function getQuestionnaire(req, res, next) {
    const questionnaireID = req.params.questionnaireID;

    res.locals.query = Questionnaire
        .findOne()
        .where({ "questionnaireID" : questionnaireID })
        .select({ "questions.options" : false })
        .lean(); // return POJO 

    next();
}

// fetch a question from the database
async function getQuestion(req, res, next) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;

    res.locals.query = Questionnaire
        .findOne()
        .where({ "questionnaireID" : questionnaireID })
        .where({ "questions" : { $elemMatch : { "qID" : questionID } } })
        .select({ "questions" : { $elemMatch : { "qID" : questionID } } })
        .select({ "questionnaireID" : false })
        .select({ "questionnaireTitle" : false })
        .select({ "keywords" : false })
        .lean(); // return POJO

    res.locals.transform = (questionnaire) => {
        return {
            questionnaireID: questionnaireID,
            ...questionnaire.questions[0] // the array will only have one element
        };
    };

    next();
}

// post an answer to the database
async function postDoAnswer(req, res, next) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;
    const sessionID = req.params.sessionID;
    const optionID = (req.params.optionID !== "null") ? req.params.optionID : "";

    res.locals.model = Answer;
    res.locals.obj = {
        questionnaireID: questionnaireID,
        session: sessionID,
        qID: questionID,
        ans: optionID,
        _uniqueID: questionnaireID + sessionID + questionID
    };

    next();
}

// fetch a session from the database
async function getGetSessionAnswers(req, res, next) {
    const questionnaireID = req.params.questionnaireID;
    const sessionID = req.params.sessionID;

    res.locals.query = Answer
        .find()
        .where({ "questionnaireID" : questionnaireID })
        .where({ "session" : sessionID })
        .select({ "questionnaireID" : false })
        .select({ "session" : false })
        .select({ "_uniqueID" : false })
        .select({ "_date" : false})
        .sort({ "qID" : "ascending" })
        .lean(); // return POJO

    res.locals.transform = (answers) => {
        return {
            questionnaireID: questionnaireID,
            session: sessionID,
            answers: answers
        };
    };

    next();
}

// fetch all the answers to a question from the database
async function getGetQuestionAnswers(req, res, next) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;

    res.locals.query = Answer
        .find()
        .where({ "questionnaireID" : questionnaireID })
        .where({ "qID" : questionID })
        .select({ "questionnaireID" : false })
        .select({ "qID" : false })
        .select({ "_uniqueID" : false })
        .sort({ "_date" : "ascending" })
        .lean(); // return POJO

    res.locals.transform = (answers) => {
        return {
            questionnaireID: questionnaireID,
            questionID: questionID,
            answers: answers
        };
    };

    next();
}

export {
    getQuestionnaire,
    getQuestion,
    postDoAnswer,
    getGetSessionAnswers,
    getGetQuestionAnswers
};

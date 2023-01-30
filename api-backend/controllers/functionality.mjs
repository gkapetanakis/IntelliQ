// this module contains all the functionality controllers

// import this package's modules
import Questionnaire from "../models/questionnaire.mjs";
import { createDocument, executeQuery } from "../lib/dbUtils.mjs";
import { handleCreateResponse, handleQueryResponse } from "../lib/apiUtils.mjs";

// fetch a questionnaire from the database
async function getQuestionnaire(req, res) {
    const questionnaireID = req.params.questionnaireID;
    
    // build query
    const query = Questionnaire
        .findOne()
        .where({ "questionnaireID" : questionnaireID })
        .select({ "questions.options" : false })
        .lean(); // return POJO

    // execute query and create response
    const { status, response } = handleQueryResponse(await executeQuery(query));

    // send response
    res.status(status).json(response);
}

// fetch a question from the database
async function getQuestion(req, res) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;

    // build query
    const query = Questionnaire
        .findOne()
        .where({ "questionnaireID" : questionnaireID })
        .where({ "questions" : { $elemMatch : { "qID" : questionID } } })
        .select({ "questions" : { $elemMatch : { "qID" : questionID } } })
        .select({ "questionnaireID" : false })
        .select({ "questionnaireTitle" : false })
        .select({ "keywords" : false })
        .lean(); // return POJO

    // define transform function
    const transform = (questionnaire) => {
        return {
            questionnaireID: questionnaireID,
            ...questionnaire["questions"][0] // the array will only have one element
        };
    };

    // execute query and create response
    const { status, response } = handleQueryResponse(await executeQuery(query), transform);

    // send response
    res.status(status).json(response);
}

// post an answer to the database
async function postDoAnswer(req, res) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;
    const sessionID = req.params.sessionID;
    const optionID = req.params.optionID;

    // construct the answer
    const obj = {
        questionnaireID: questionnaireID,
        session: sessionID,
        qID: questionID,
        ans: optionID,
        _uniqueID: questionnaireID + sessionID + questionID
    };

    // create and save the answer document
    const status = handleCreateResponse(await createDocument(obj, Answer));

    // send the response
    res.status(status).send();
}

// fetch a session from the database
function getGetSessionAnswers(req, res) {
    // TODO
}

// fetch all the answers to a question from the database
function getGetQuestionAnswers(req, res) {
    // TODO
}

export { getQuestionnaire, getQuestion, postDoAnswer, getGetSessionAnswers, getGetQuestionAnswers };

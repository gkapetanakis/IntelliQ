// this module contains all the functionality controllers

// import this package's modules
import Questionnaire from "../models/questionnaire.mjs";
import { executeQuery } from "../lib/dbUtils.mjs";
import { handleQueryResponse } from "../lib/apiUtils.mjs";

// fetch a questionnaire from the database
async function getQuestionnaire(req, res) {
    const questionnaireID = req.params.questionnaireID;

    console.debug("Get Questionnaire Start");
    
    // build query
    const query = Questionnaire
        .findOne()
        .where({ "questionnaireID" : questionnaireID })
        .select({ "questions.options" : false })
        .lean(); // return POJO

    // define transform function
    const transform = (questionnaire) => {
        // sort questions by increasing ID
        questionnaire["questions"].sort((q1, q2) =>
            (q1["qID"] < q2["qID"] ? -1 : 1)
        );
        return questionnaire;
    };

    // execute query and create response
    const { status, response } = handleQueryResponse(await executeQuery(query), transform);

    // send response
    res.status(status).json(response);

    console.debug("Get Questionnaire End");
}

// fetch a question from the database
async function getQuestion(req, res) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;

    console.debug("Get Question Start");

    // build query
    const query = Questionnaire
        .findOne()
        .where({ "questionnaireID" : questionnaireID })
        .elemMatch("questions", { "qID" : questionID })
        .select({ "questionnaireID" : false })
        .select({ "questionnaireTitle" : false })
        .select({ "keywords" : false })
        .select({ "questions" : { $elemMatch : { "qID" : questionID } } })
        .lean(); // return POJO

    // define transform function
    const transform = (questionnaire) => {
        // sort the options by increasing ID
        questionnaire["questions"][0]["options"].sort((o1, o2) =>
            o1["optID"] < o2["optID"] ? -1 : 1
        );
        return {
            questionnaireID: questionnaireID,
            ...questionnaire["questions"][0]
        };
    };

    // execute query and create response
    const { status, response } = handleQueryResponse(await executeQuery(query), transform);

    // send response
    res.status(status).json(response);

    console.debug("Get Question End");
}

// post an answer to the database
function postDoAnswer(req, res) {
    // TODO
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

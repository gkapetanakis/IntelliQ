import { noNextQuestionID, baseUrl, currentScreen } from "../stores/dataStores";
import { MyError }  from "./myError";

async function searchQuestionnaire(ID) {
    try {
        const url = `${baseUrl}/questionnaire/${ID}`;
        const response = await fetch(url);
        
        let content;
        if (response?.ok) {
            const questionnaire = await response.json();
    
            // set-up questionnaire information
            const {questionnaireID, questionnaireTitle} = questionnaire;
            const firstQuestionID = getFirstQuestionID(questionnaire);
    
            const questionnaireInfo = {
                questionnaireID,
                questionnaireTitle,
                nextQuestionID: firstQuestionID
            };

            // get all of the question IDs of the questionnaire in an array. Useful for optional
            // questions. In those we just set nextQuestionID equal to the ID of the next question
            // in the questions Array.
            const questionsArray = questionnaire.questions.map(question => question.qID);
    
            content = {questionnaireInfo, questionsArray};        
        }
        else {
            content = await response.text();
            throw new MyError({
                message: content,
                statusCode: response.status
            })
        }
        return content;

    } catch (err) {
        throw new MyError({
            message: err.message,
            name: err.name,
            statusCode: err?.statusCode
        });
    }

    function getFirstQuestionID(questionnaire) {
        const { questions } = questionnaire;
        return questions[0]["qID"];
    }
}

function searchNextQuestionID(
    questionsArray,
    nextQuestion,
    chosenOpt = null) {// chosenOpt is an option object: { optID, opttxt, nextqID }

    let nextqID = null;
    if (!chosenOpt) { // user made no choice (could happen in optional questions...)
        const nextIndex = questionsArray.findIndex(qID => qID === nextQuestion.qID) + 1;
        if (nextIndex < questionsArray.length)
            nextqID = questionsArray[nextIndex];
    }
    else { // user made a choice
        nextqID = chosenOpt.nextqID;
    }
    return nextqID;   
}

async function searchNextQuestion(questionnaireInfo) {
    try {
        const { questionnaireID, nextQuestionID } = questionnaireInfo;
        if (nextQuestionID === noNextQuestionID) {
            currentScreen.set("finishedScreen"); // user reached the end!
            return null;
        }
    
        const url = `${baseUrl}/question/${questionnaireID}/${nextQuestionID}`;
        const response = await fetch(url);
    
        if (response?.ok) {
            return await response.json();
        } else {
            const content = await response.text();
            throw new MyError({
                message: content,
                statusCode: response.status
            });
        }

    } catch (err) {
        throw new MyError({
            message: err.message,
            name: err.name,
            statusCode: err?.statusCode
        });
    }
}

export { searchQuestionnaire, searchNextQuestionID, searchNextQuestion };
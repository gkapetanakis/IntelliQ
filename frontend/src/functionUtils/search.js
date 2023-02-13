import { noNextQuestionID } from "../dataUtils/constantValues";
import { fetchQuestionnaireURL ,fetchQuestionURL } from "../dataUtils/paths";
import { errorInfo } from "../dataUtils/stores";

async function searchQuestionnaire(questionnaireID) {
    try {
        const url = fetchQuestionnaireURL({questionnaireID});
        const response = await fetch(url);

        let content;
        if (response?.ok) {
            const questionnaire = await response.json();
            const {questionnaireID, questionnaireTitle} = questionnaire;
            const firstQuestionID = getFirstQuestionID(questionnaire);

            const questionnaireInfo = {
                questionnaireID,
                questionnaireTitle,
                nextQuestionID: firstQuestionID
            };

            // get all the questions in an array
            const questionsArray = questionnaire.questions.map(question => question.qID);
            content = { questionnaireInfo, questionsArray };
            return content;
        } else { // response was very not okay!
            content = await response.json();
            errorInfo.set({
                message: content.message,
                statusCode: response.status
            });
        }
    } catch (err) { // SOME ERROR! We couldn't even fetch ?!
        errorInfo.set({
            message: err.message,
            name: err.name,
            statusCode: err?.statusCode // probably won't be any... :(
        });
    }

    // helper function
    function getFirstQuestionID(questionnaire) {
        const { questions } = questionnaire;
        return questions[0]["qID"];
    }
}

async function searchNextQuestion(questionnaireInfo) {
    try {
        const { questionnaireID, nextQuestionID } = questionnaireInfo;

        const url = fetchQuestionURL({questionnaireID, nextQuestionID});
        const response = await fetch(url);
        let content;
        if (response?.ok) {
            content = await response.json();
            return content;
        } else {
            content = await response.json();
            errorInfo.set({
                message: content.message,
                statusCode: response.status
            });
        }
    } catch (err) {
        errorInfo.set({
            message: err.message,
            name: err.name,
            statusCode: err?.statusCode
        });
    }
}

function searchNextQuestionID(
    questionsArray,
    nextQuestion,
    chosenOpt = null ) { // chosenOpt is an option object: { optID, opttxt, nextqID }

    let nextqID = noNextQuestionID;
    if (!chosenOpt) { // user made no choice
        const nextIndex = questionsArray.findIndex(qID => qID === nextQuestion.qID) + 1;
        if (nextIndex < questionsArray.length)
            nextqID = questionsArray[nextIndex];  
    } else {
        nextqID = chosenOpt.nextqID;
    }
    return nextqID;
}

export {
    searchQuestionnaire,
    searchNextQuestionID,
    searchNextQuestion
};
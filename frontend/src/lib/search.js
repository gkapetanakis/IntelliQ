import { noNextQuestionID, baseUrl, fetchInfo } from "../stores/dataStores";

async function searchQuestionnaire(ID) {
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
        const questionsArray = questionnaire.questions.map(question => question.qID);

        content = {questionnaireInfo, questionsArray};        
    }
    else {
        content = await response.text();
    }

    fetchInfo.set({ status: response.status, content });
    return content;

    function getFirstQuestionID(questionnaire) {
        const { questions } = questionnaire;
        return questions[0]["qID"];
    }
}

function searchNextQuestionID(
    questionsArray,
    nextQuestion,
    chosenOpt = null) {

    let nextqID = null;
    if (!chosenOpt) { // user made no choice
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
    const { questionnaireID, nextQuestionID } = questionnaireInfo;

    if (nextQuestionID === noNextQuestionID) {
        return {finished: true, nextQuestion: null};
    }

    const url = `${baseUrl}/question/${questionnaireID}/${nextQuestionID}`;
    const response = await fetch(url);

    const content = await response.json();

    fetchInfo.set({status: response.status, content});
    return {finished: false, nextQuestion: content};
}

export { searchQuestionnaire, searchNextQuestionID, searchNextQuestion };
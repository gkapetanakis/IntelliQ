import { baseUrl } from "../store/dataStore";

//set-up data for the next question
async function findNextQuestion(questionnaireInfo) {
    let nextQuestion;

    const {questionnaireID, nextQuestionID} = questionnaireInfo;
    try {
        const url = `${baseUrl}/question/${questionnaireID}/${nextQuestionID}`;

        const response = await fetch(url);
        nextQuestion = await response.json();

    } catch (e) {
        console.log(e.message);
    }

    return nextQuestion;
}

export { findNextQuestion };
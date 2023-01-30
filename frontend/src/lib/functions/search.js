import { baseUrl } from "../store/dataStore";

async function searchQuestionnaire(ID) {
    let questionnaireInfo;
    let questionsArray;
    let error = null;
    try {
        const url = `${baseUrl}/questionnaire/${ID}`;

        const response = await fetch(url);

        const questionnaire = await response.json();

        // set-up questionnaire information
        const {questionnaireID, questionnaireTitle} = questionnaire;
        const firstQuestionID = getFirstQuestionID(questionnaire);
        questionnaireInfo = {
            questionnaireID,
            questionnaireTitle,
            nextQuestionID: firstQuestionID
        };
        
        questionsArray = questionnaire.questions.map(question => question.qID);

    } catch (e) {
        console.log(e.message);
    }

    return {questionnaireInfo, questionsArray, error};

    function getFirstQuestionID(questionnaire) {
        const {questions} = questionnaire;
        return questions[0]["qID"];
    }

}

export {searchQuestionnaire};
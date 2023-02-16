const baseUrl = import.meta.env.VITE_API_URL;

function fetchQuestionnaireURL({questionnaireID}) {
    return `${baseUrl}/questionnaire/${questionnaireID}`;
}

function fetchQuestionURL({questionnaireID, nextQuestionID}) {
    return `${baseUrl}/question/${questionnaireID}/${nextQuestionID}`;
}

function fetchAnswerURL({
    questionnaireID,
    questionID,
    session,
    optionID
}) {
    return `${baseUrl}/doanswer/${questionnaireID}/${questionID}/${session}/${optionID}`;
} // optionID could be null, if no answer was submitted.

export {
    fetchQuestionnaireURL,
    fetchQuestionURL,
    fetchAnswerURL
};
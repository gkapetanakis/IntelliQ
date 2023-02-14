const baseUrl = ""
+ `http://${import.meta.env.VITE_APP_HOST}`
+ `:${import.meta.env.VITE_APP_PORT}`
+ `${import.meta.env.VITE_APP_BASE_URL}`;

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
} // optionID could be "". Maybe edit this later, but for now it works fine

export {
    fetchQuestionnaireURL,
    fetchQuestionURL,
    fetchAnswerURL
};
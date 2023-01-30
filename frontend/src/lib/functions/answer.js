import { baseUrl } from "../store/dataStore";

function findNextQuestionID(questionArray, nextQuestion, chosenOpt = null) {
    let nextqID = null;
    if (!chosenOpt) {// user skipped optional question
        let nextIndex = questionArray.findIndex(qID => qID === nextQuestion.qID);
        nextIndex += 1;
        if (nextIndex <= questionArray.length) nextqID = questionArray[nextIndex];
    }
    else {
        if (!!chosenOpt.nextqID) nextqID = chosenOpt.nextqID;
    }
    return nextqID;
}

async function doAnswerAndStartSession(questionnaireID, questionID, session = null, optionID) {
    try {
        if (!session) {
            session = generateID();
        }
        
        const url = `${baseUrl}/doanswer/${questionnaireID}/${questionID}/${session}/${optionID}`;
        const response = await fetch(url, { method: "POST", });

        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.log(e.message);
    }

    return session;
    
    function generateID(length = 4) {
        return (Math.random().toString(36).substring(2)
        + Date.now().toString(36)).substring(0,length);
    }
}

export { findNextQuestionID, doAnswerAndStartSession };
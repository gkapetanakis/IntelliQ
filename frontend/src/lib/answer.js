import { baseUrl, fetchInfo } from "../stores/dataStores";

async function doAnswerAndStartSession(questionnaireID, questionID, session = null, optionID) {
    if (!session) {
        session = generateID();
    }
    
    const url = `${baseUrl}/doanswer/${questionnaireID}/${questionID}/${session}/${optionID}`;
    const response = await fetch(url, { method: "POST", });
    
    let content = "";
    if (!response?.ok) {
        content = await response.json();
    }
    else {
        content = await response.text();
    }

    fetchInfo.set({ status: response.status, content });
    return session;
    
    function generateID(length = 4) {
        return (Math.random().toString(36).substring(2)
        + Date.now().toString(36)).substring(0,length);
    }
}

export { doAnswerAndStartSession };
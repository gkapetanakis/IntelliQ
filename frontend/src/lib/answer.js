import { baseUrl } from "../stores/dataStores";
import { MyError }  from "./myError";

// # of retries we'll do if the session we generate already exists
const maxIters = 3;

async function doAnswerAndStartSession(questionnaireID, questionID, session = null, optionID, iterations = 0) {
    if (!session && iterations < maxIters) {
        session = generateID();
    }

    try {
            
        const url = `${baseUrl}/doanswer/${questionnaireID}/${questionID}/${session}/${optionID}`;
        const response = await fetch(url, { method: "POST", });
        
        let content = "";
        
        if (response?.ok) {
            content = await response.text();
            return session;
        }
        else {
            content = await response.text();
            throw new MyError({
                message: content,
                statusCode: response.status
                });
        }
    } catch (err) {
        // retry to get a valid session
        if (iterations < maxIters && err?.statusCode) {
            return doAnswerAndStartSession(questionnaireID, questionID, null, optionID, iterations + 1);
        }
        throw new MyError({
            message: err.message,
            name: err.name,
            statusCode: err?.statusCode
        });
    }

    // magic ID generator...
    function generateID(length = 4) {
        return (Math.random().toString(36).substring(2)
        + Date.now().toString(36)).substring(0,length);
    }
}

export { doAnswerAndStartSession };
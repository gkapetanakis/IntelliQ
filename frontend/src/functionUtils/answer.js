import { StatusCodes } from "http-status-codes";
import { fetchAnswerURL } from "../dataUtils/paths";
import { errorInfo } from "../dataUtils/stores";

// # of retries in case of already occupied session
const maxIters = 3;

async function doAnswerAndStartSession(
    questionnaireID,
    questionID,
    session = null,
    optionID, // may be the empty string
    iterations = 0
) {
    if (!session) {
        session = generateID();
    }

    if (!optionID) {
        optionID = null;
    } // send null when no answer is given

    try {
        const url = fetchAnswerURL({
            questionnaireID,
            questionID,
            session,
            optionID});

        const response = await fetch(url, { method: "POST", });

        let content;
        if (response?.ok) {
            content = await response.text(); // will be empty string
            return session;
        } else {
            // retry to get a valid session
            if (iterations < (maxIters - 1) &&
                (response.status === StatusCodes.BAD_REQUEST || response.status === StatusCodes.NOT_FOUND)) {
                return doAnswerAndStartSession(
                    questionnaireID,
                    questionID,
                    null,
                    optionID,
                    iterations + 1);
            }
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

    // simple ID generator
    function generateID(length = 4) {
        const chars = ""
            + "0123456789"
            + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            + "abcdefghijklmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
}

export { doAnswerAndStartSession };
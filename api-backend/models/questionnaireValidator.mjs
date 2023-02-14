import mongoose from "mongoose";

// moved the validator here to clean up the code of the questionnaire module
function questionnaireCustomValidator(questionnaire) {
    // globally unique checking
    const qIDs = new Set();
    const optIDs = new Set();

    // all possible errors
    let dupeQ = false;
    let dupeO = false;
    let prevN = false;
    let invalidN = false;
    let invalidOpenText = false;
    let invalidTxtReference = false;

    let err = null;
    if (questionnaireCustomValidatorHelper(
        questionnaire.questions[0],
        new Set(),
        new Set()
    )) {
        err = new mongoose.Error.ValidationError(questionnaire);
        if (dupeQ)
            err.addError("question.qID", new mongoose.Error.ValidatorError({
                path: "qID", reason: "duplicate qID is not allowed"
            }));
        if (dupeO)
            err.addError("question.option.optID", new mongoose.Error.ValidatorError({
                path: "optID", reason: "duplicate optID is not allowed"
            }));
        if (prevN)
            err.addError("question.option.nextqID", new mongoose.Error.ValidatorError({
                path: "nextqID", reason: "nextqID that references previous question is not allowed"
            }));
        if (invalidN)
            err.addError("questions.option.nextqID", new mongoose.Error.ValidatorError({
                path: "nextqID", reason: "nextqID that references nonexistent question is not allowed"
            }));
        if (invalidOpenText)
            err.addError("questions.option.opttxt", new mongoose.Error.ValidatorError({
                path: "opttxt", reason: "open text questions must ony have one option"
            }));
        if (invalidTxtReference)
            err.addError("question.option.qtext", new mongoose.Error.ValidatorError({
                path: "qtext", reason: "qtext references question the user couldn't have answered"
            }));
    }
    return err;

    // ----------------- helper function --------------------
    function questionnaireCustomValidatorHelper(
        pQ,
        bQIDs,
        bOptIDs
    ) {
        const parentQ = pQ;
        const branchQIDs = new Set(bQIDs); // we don't want to influence the original sets.
        const branchOptIDs = new Set(bOptIDs); // Use a copy constructor
        // globally unique qID
        if (qIDs.has(parentQ.qID)) {
            dupeQ = true;
            return true;
        }
        else {
            qIDs.add(parentQ.qID);
            branchQIDs.add(parentQ.qID);
        }

        // reference in qtext only to previous questions/options on the branch
        const regex = /\[\*(.*?)\]/g; // look for strings like this one: "[*string]"
        let match;
        while ((match = regex.exec(parentQ.qtext)) !== null) {
            const word = match[1];
            if (!branchQIDs.has(word) && !branchOptIDs.has(word)) {
                invalidTxtReference = true;
                return true;
            }
        }

        // time to check options!
        for (const option of parentQ.options) {
            // globally unique optID
            if (optIDs.has(option.optID)) {
                dupeO = true;
                return true;
            }
            else {
                optIDs.add(option.optID);
                branchOptIDs.add(option.optID);
            }

            // nextqID is not a previous qID in the branch
            if (branchQIDs.has(option.nextqID)) {
                prevN = true;
                return true;
            }

            // valid open text question
            if (option.opttxt === "<open string>" && parentQ.options.length !== 1) {
                invalidOpenText = true;
                return true;
            }

            if (option.nextqID === "-") continue;

            // for each option create a branch
            let newParentQ = questionnaire.questions.filter(question => question.qID === option.nextqID);
            if (newParentQ.length !== 1) {
                invalidN = true;
                return true;
            }
            newParentQ = newParentQ[0];

            if(questionnaireCustomValidatorHelper(
                newParentQ,
                branchQIDs,
                branchOptIDs,
            )) {
                return true;
            }
        }

        // everything went well...
        return false;
    }
}

export default questionnaireCustomValidator;

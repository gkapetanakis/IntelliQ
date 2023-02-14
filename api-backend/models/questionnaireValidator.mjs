import mongoose from "mongoose";

// moved the validator here to clean up the code of the questionnaire module
function questionnaireCustomValidator(questionnaire) {

    let questionnaireObject = {};
    let nextQuestionID = {};
    for (const question of questionnaire.questions) {
        questionnaireObject[question.qID] = question;
    } // probably faster lookups

    for (let i = 0; i < questionnaire.questions.length; ++i) {
        questionnaireObject[questionnaire.questions[i].qID] = questionnaire.questions[i];
        if (i < questionnaire.questions.length - 1)
            nextQuestionID[questionnaire.questions[i].qID] = questionnaire.questions[i + 1].qID;
        else
            nextQuestionID[questionnaire.questions[i].qID] = "-";
    }
    
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
            err.addError("question.qtext", new mongoose.Error.ValidatorError({
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

        // unique qID
        if (branchQIDs.has(parentQ.qID)) {
            dupeQ = true;
            return true;
        }
        else {
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

        // unique optID
        let optionsArray = parentQ.options;
        if (parentQ.required === "false") {
            const getNextQuestionID = nextQuestionID[parentQ.qID];
            const newChild = questionnaireObject[getNextQuestionID];
            if (!!newChild) {
                optionsArray = [...optionsArray, newChild];
            }
        }
        for (const option of optionsArray) {
                if (branchOptIDs.has(option.optID)) {
                    dupeO = true;
                    return true;
                }
                else {
                    branchOptIDs.add(option.optID);
                }
        }

        // time to check options!
        for (const option of optionsArray) {
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
            const newParentQ = questionnaireObject[option.nextqID];
            if (!newParentQ) {
                invalidN = true;
                return true;
            }

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

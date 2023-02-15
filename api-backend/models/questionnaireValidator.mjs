import mongoose from "mongoose";

// moved the validator here to clean up the code of the questionnaire module
function questionnaireCustomValidator(questionnaire) {
    const qIDs = new Set();
    const optIDs = new Set();
    const nextqIDs = new Set();

    let dupeQ = false;
    let dupeO = false;
    let prevN = false;
    let invalidN = false;
    let invalidOpenText = false;

    for (const question of questionnaire.questions) {

        // unique qID
        if (qIDs.has(question.qID))
            dupeQ = true;
        else
            qIDs.add(question.qID);
        
        for (const option of question.options) {

            // unique optID
            if (optIDs.has(option.optID))
                dupeO = true;
            else
                optIDs.add(option.optID);

            // valid open text
            if (option.opttxt === "<open string>" && question.options.length > 1)
            invalidOpenText = true;

            // not previous nextqID
            if (option.nextqID === "-")
                continue;
            else if (qIDs.has(option.nextqID))
                prevN = true;
            else
                nextqIDs.add(option.nextqID);
        }
    }

    // valid nextqID
    for (const nextqID in nextqIDs)
        if (!qIDs.has(nextqID))
            invalidN = true;

    let err = null;
    const error = dupeQ || dupeO || prevN || invalidN || invalidOpenText;
    if (error) {
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
    }
    return err;
}

export default questionnaireCustomValidator;

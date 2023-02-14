import mongoose from "mongoose";

// moved the validator here to clean up the code of the answer module
async function answerCustomValidator(answer) {
    const Questionnaire = mongoose.model("Questionnaire");

    let invalidID = false;
    let invalidqID = true; // assume it is invalid
    let invalidans = true; // assume it is invalid

    // check if the questionnaireID is valid, i.e. a questionnaire
    // with that ID exists
    let questionnaire = null;
    try {
        questionnaire = await Questionnaire
            .findOne()
            .where({ "questionnaireID" : answer.questionnaireID })
            .select({ "questionnaireID" : false })
            .select({ "questionnaireTitle" : false })
            .select({ "keywords" : false })
            .lean(); // return POJO
    }
    catch (err) {
        return err;
    }

    let err = null;
    invalidID = !questionnaire;
    if (!invalidID) {
        // the questionnaire exists
        for (const question in questionnaire.questions) {

            // continue until a question with the same qID is found
            if (question.qID !== answer.qID)
                continue;

            // question found
            invalidqID = false;

            // if an aswer is not required, and none has been given, then ans is valid
            if (question.required === "false" && answer.ans === "") {
                invalidans = false;
            }

            // if the question is open string and any answer has been given, then ans is valid
            else if (question.options[0].opttxt === "<open string>" && answer.ans !== "") {
                invalidans = false;
            }

            // if ans has not been validated yet, validate it            
            if (invalidans) {
                for (const option in question.options) {
                    // continue until an option with the same ID is found
                    if (option.optID !== answer.ans)
                        continue;

                    // option found, ans is valid
                    invalidans = false;
                    break;
                }
            }
        }
    }
    else {
        // questionnaire does not exist
        err = new mongoose.Error.ValidationError(answer);
        err.addError("questionnaireID", new mongoose.Error.ValidatorError({
            path: "questionnaireID", reason: "no such questionnaire exists" 
        }));        
    }

    const error = !invalidID && (invalidqID || invalidans);
    if (error) {
        err = new mongoose.Error.ValidationError(answer);
        if (invalidqID)
            err.addError("qID", new mongoose.Error.ValidatorError({
                path: "qID", reason: "the questionnaire does not have a question with this qID"
            }));
        else if (invalidans)
            err.addError("ans", new mongoose.Error.ValidatorError({
                path: "ans", reason: "ans is invalid"
            }));
    }

    return err;
};

export default answerCustomValidator;

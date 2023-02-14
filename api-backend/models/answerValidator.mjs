import mongoose from "mongoose";

// moved the validator here to clean up the code of the answer module
async function answerCustomValidator(answer) {
    const Questionnaire = mongoose.model("Questionnaire");

    let invalidID;
    let invalidqID;
    let invalidans;

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
        // questionnaire exists

        // search for question
        const questionHelper = questionnaire.questions.filter(question => question.qID === answer.qID);
        if (questionHelper.length !== 1) {
            invalidqID = true;
        }
        else { // question found
            invalidqID = false;
            const question = questionHelper[0];

            invalidans = true; // we are going to attempt to validate the answer

            // if an aswer is not required, and none has been given, then it's valid
            if (question.required === "false" && answer.ans === "") {
                invalidans = false;
            }
            // if the question is open string and any answer has been given, then it's valid
            else if (question.options[0].opttxt === "<open string>" && answer.ans !== "") {
                invalidans = false;
            }
            // if the answer has not been validated yet, validate it            
            if (invalidans) {
                for (const option of question.options) {
                    // if the answer matches with an optID, then it's valid
                    if (option.optID !== answer.ans)
                    continue;
                    invalidans = false;
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
        if (invalidqID) // fixed this
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

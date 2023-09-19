// import third party modules
import mongoose, { mongo } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// import this package's modules
import * as debugUtils from "../lib/debugUtils.mjs";
import answerCustomValidator from "./answerValidator.mjs";

// the type of this schema's documents
const docType = "Answer";

const answerSchema = new mongoose.Schema({
    questionnaireID: { type: String, required: true },
    session: { type: String, required: true, minLength: 4, maxLength: 4 },
    qID: { type: String, required: true },
    ans: { type: String, default: "" },
    // _uniqueID will be used to easily enforce that an answer is unique
    // it will be equal to questionnaireID + session + qID
    _uniqueID: { type: String, required: true, unique: true },
    // _date is required in order to be able to sort answers chronologically
    _date: { type: Date, default: Date.now }
});

// easily handle duplicate unique fields
answerSchema.plugin(uniqueValidator);

// if built-in validation is successful, perform custom validation
answerSchema.post(/validate/, async function(doc, next) {
    const err = await answerCustomValidator(doc);
    next(err); // err is either an error or undefined
});

answerSchema.post(/save/, debugUtils.successfulSaveHook(docType)); // hook if save succeeds
answerSchema.post(/save/, debugUtils.failedSaveHook(docType)); // hook if save fails
answerSchema.post(/find/, debugUtils.successfulFindHook(docType)); // hook if find succeeds
answerSchema.post(/find/, debugUtils.failedFindHook(docType)); // hook if find fails
answerSchema.post(/delete/, debugUtils.successfulDeleteHook(docType)); // hook if delete succeeds
answerSchema.post(/delete/, debugUtils.failedDeleteHook(docType)); // hook if delete fails

export default mongoose.model(docType, answerSchema);

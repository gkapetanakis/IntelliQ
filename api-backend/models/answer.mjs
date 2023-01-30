// import third party modules
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// import this package's modules
import * as debugUtils from "../lib/debugUtils.mjs";

// the type of this schema's documents
const docType = "Answer";

const answerSchema = new mongoose.Schema({
    questionnaireID: { type: String, required: true },
    session: { type: String, required: true },
    qID: { type: String, required: true },
    ans: { type: String, default: "-" },
    // _uniqueID will be used to easily enforce that an answer is unique
    // it will be equal to questionnaireID + session + qID
    _uniqueID: { type: String, required: true, unique: true },
    // _date is required in order to be able to sort answers chronologically
    _date: { type: Date, default: Date.now }
});

// easily handle duplicate unique fields
answerSchema.plugin(uniqueValidator);

answerSchema.post(/save/, debugUtils.successfulSaveHook(docType)); // hook if save succeeds
answerSchema.post(/save/, debugUtils.failedSaveHook(docType)); // hook if save fails
answerSchema.post(/find/, debugUtils.successfulFindHook(docType)); // hook if find succeeds
answerSchema.post(/find/, debugUtils.failedFindHook(docType)); // hook if find fails
answerSchema.post(/delete/, debugUtils.successfulDeleteHook(docType)); // hook if delete succeeds
answerSchema.post(/delete/, debugUtils.failedDeleteHook(docType)); // hook if delete fails

export default mongoose.model(docType, answerSchema);

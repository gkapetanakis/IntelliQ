// import third party modules
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const answerSchema = new mongoose.Schema({
    session: { type: String, required: true },
    questionnaireID: { type: String, required: true },
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

// mainly used for debugging
answerSchema.post(/save/, function(err, res, next) {
    if (!err) {
        console.debug("Answer: 'save' operation completed successfully");
        console.debug(`${res.isArray() ? res.length : 1} document${res.isArray() && res.length !== 1 ? "s were" : " was"} created`);
    } else
        console.error("Answer: error during 'save' operation");
    next();
});

// mainly used for debugging
answerSchema.post(/find/, function(err, res, next) {
    if (!err) {
        console.debug("Answer: 'find' operation completed successfully");
        console.debug(`${res.isArray() ? res.length : 1} document${res.isArray() && res.length !== 1 ? "s were" : " was"} found`);
    } else
        console.error("Answer: error during 'find' operation");
    next();
});

// mainly used for debugging
answerSchema.post(/delete/, function(err, res, next) {
    if (!err) {
        console.debug("Answer: 'delete' operation completed successfully");
        console.debug(`${res.deletedCount} answer${res.deletedCount !== 1 ? "s were" : " was"} deleted`);
    } else
        console.error("Answer: error during 'delete' operation");
    next();
});

export default mongoose.model("Answer", answerSchema);

// import third party modules
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const optionSchema = new mongoose.Schema({
    optID: { type: String, required: true },
    opttxt: { type: String, required: true },
    nextqID: { type: String, default: "-" }
});

const questionSchema = new mongoose.Schema({
    qID: { type: String, required: true },
    qtext: { type: String, required: true },
    required: { type: String, enum: ["true", "false"], lowercase: true, default: "false" },
    type: { type: String, required: true, enum: ["question", "profile"] },
    options: [{ type: optionSchema, required: true }]
});

const questionnaireSchema = new mongoose.Schema({
    questionnaireID: { type: String, required: true, unique: true },
    questionnaireTitle: { type: String, required: true },
    keywords: [{ type: String }],
    questions: [{ type: questionSchema, required: true }]
});

// easily handle duplicate unique fields
questionnaireSchema.plugin(uniqueValidator);

questionnaireSchema.pre(/save/, function(next) {
    // sort questions by increasing qID before saving document
    // to avoid having to sort after every 'find'
    this["questions"].sort((q1, q2) =>
        q1["qID"] < q2["qID"] ? -1 : 1
    );
    
    // sort options by increasing optID before saving document
    // to avoid having to sort after every 'find'
    this["questions"].forEach((question) => {
        question["options"].sort((o1, o2) =>
            o1["optID"] < o2["optID"] ? -1 : 1
        );
    });
    
    next();
});

// mainly used for debugging
questionnaireSchema.post(/save/, function(err, res, next) {
    if (!err) {
        console.debug("Questionnaire: 'save' operation completed successfully");
        console.debug(`${res.isArray() ? res.length : 1} document${res.isArray() && res.length !== 1 ? "s were" : " was"} created`);
    } else
        console.error("Questionnaire: error during 'save' operation");
    next();
});

// mainly used for debugging
questionnaireSchema.post(/find/, function(err, res, next) {
    if (!err) {
        console.debug("Questionnaire: 'find' operation completed successfully");
        console.debug(`${res.isArray() ? res.length : 1} document${res.isArray() && res.length !== 1 ? "s were" : " was"} found`);
    } else
        console.error("Questionnaire: error during 'find' operation");
    next();
});

// mainly used for debugging
questionnaireSchema.post(/delete/, function(err, res, next) {
    if (!err) {
        console.debug("Questionnaire: 'delete' operation completed successfully");
        console.debug(`${res.deletedCount} questionnaire${res.deletedCount !== 1 ? "s were" : " was"} deleted`);
    } else
        console.error("Questionnaire: error during 'delete' operation");
    next();
});

export default mongoose.model("Questionnaire", questionnaireSchema);

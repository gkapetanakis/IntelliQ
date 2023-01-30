// import third party modules
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// import this package's modules
import * as debugUtils from "../lib/debugUtils.mjs";

// the type of this schema's documents
const docType = "Questionnaire";

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

// will run before a questionnaire is saved
questionnaireSchema.pre(/save/, function(next) {
    // doing this for hook to work even when saving multiple documents
    const questionnaires = Array.isArray(this) ? this : [this];

    questionnaires.forEach((questionnaire) => {
        // sort questions by increasing qID before saving document
        // to avoid having to sort after every 'find'
        questionnaire["questions"].sort((q1, q2) =>
            q1["qID"] < q2["qID"] ? -1 : 1
        );
        // sort options by increasing optID before saving document
        // to avoid having to sort after every 'find'
        questionnaire["questions"].forEach((question) => {
            question["options"].sort((o1, o2) =>
                o1["optID"] < o2["optID"] ? -1 : 1
            );
        });
    });

    next();
});

questionnaireSchema.post(/save/, debugUtils.successfulSaveHook(docType)); // hook if save succeeds
questionnaireSchema.post(/save/, debugUtils.failedSaveHook(docType)); // hook if save fails
questionnaireSchema.post(/find/, debugUtils.successfulFindHook(docType)); // hook if find succeeds
questionnaireSchema.post(/find/, debugUtils.failedFindHook(docType)); // hook if find fails
questionnaireSchema.post(/delete/, debugUtils.successfulDeleteHook(docType)); // hook if delete succeeds
questionnaireSchema.post(/delete/, debugUtils.failedDeleteHook(docType)); // hook if delete fails

export default mongoose.model(docType, questionnaireSchema);

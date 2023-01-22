import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    optID: { type: String, required: true },
    opttxt: { type: String, required: true },
    nextqID: { type: String, default: "-" }
});

const questionSchema = new mongoose.Schema({
    qID: { type: String, required: true },
    qtext: { type: String, required: true },
    required: { type: String, enum: ["true", "false", "TRUE", "FALSE"], default: "false" },
    type: { type: String, required: true, enum: ["question", "profile"] },
    options: [{ type: optionSchema, required: true }]
});

const questionnaireSchema = new mongoose.Schema({
    questionnaireID: { type: String, required: true, unique: true },
    questionnaireTitle: { type: String, required: true },
    keywords: [{ type: String }],
    questions: [{ type: questionSchema, required: true }]
});

export default mongoose.model("Questionnaire", questionnaireSchema);

import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    qID: { type: String, required: true },
    ans: { type: String, required: true }
});

const sessionSchema = new mongoose.Schema({
    session: { type: String, required: true, unique: true },
    questionnaireID: { type: String, required: true },
    answers: [{ type: answerSchema, required: true }]
});

export default mongoose.model("Session", sessionSchema);

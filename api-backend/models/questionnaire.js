const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema({
	// _id exists by default
	title: {type: String, required: true,},
	keywords: [String],
	questions: [{
		// _id exists by default
		text: {type: String, required: true,},
		required: {type: Boolean, default: false,},
		type: {type: String, required: true, enum: ["question", "profile"],},
		options: [{
			// _id exists by default
			text: {type: String, required: true,},
			nextQuestionId: {type: String, default: "None",},
		}],
	}],
});

module.exports = mongoose.model("Questionnaire", questionnaireSchema);

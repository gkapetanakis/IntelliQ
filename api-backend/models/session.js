const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
	// _id exists by default
	questionnaireId: {type: String, required: true,},
	answers: [{
		// _id exists by default
		questionId: {type: String, required: true,},
		optionId: {type: String, required: true,},
	}],
});

module.exports = mongoose.model("Session", sessionSchema);

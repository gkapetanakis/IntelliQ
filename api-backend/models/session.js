const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
	_id: {type: String, required: true, unique: true,},
	questionnaireId: {type: String, required: true,},
	answers: [{
		_id: {type: String, required: true, unique: true},
		questionId: {type: String, required: true,},
		optionId: {type: String, required: true,},
	}],
});

module.exports = mongoose.model("Session", sessionSchema);

const mongoose = require("mongoose");

const poemSchema = new mongoose.Schema({
		title: String,
		body: String,
		comments: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}],
		likes: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}],
		dislikes: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}],
		createdDate: {type: Date, default: Date.now}

	});

module.exports = mongoose.model("Poem", poemSchema);
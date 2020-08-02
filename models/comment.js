const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
			title: String,
			author: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User"
				},
				name: String,
				username: String
			},
			replies: [
				{
					author_id: mongoose.Schema.Types.ObjectId,
					title: String,
					author: String,
					createdDate: {type: Date, default: Date.now}
				}
			],
			likes: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}],
			createdDate: {type: Date, default: Date.now}
		});

module.exports = mongoose.model("Comment", commentSchema);

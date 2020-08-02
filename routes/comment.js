const express 		= require("express");
const router 		= express.Router({mergeParams: true});
const Poem 		= require("../models/poem");
const Comment 		= require("../models/comment");
const middleware 	= require("../middleware");

//CREATE ROUTE (COMMENTS SECTION) - POST - /poems/:id/comments
router.post("/poems/:id/comments", middleware.isLoggedIn, (req, res) => {
	//Find the Poem
	Poem.findById(req.params.id, (err, foundPoem) => {
		if(err || !foundPoem){
			//console.log(err);
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
			//If the poem is found
			Comment.create(req.body.comments, (err, comment) => {
				if(err){
					console.log(err);
				}else{
					//add the current user id to the comment id
					comment.author.id = req.user._id
					//add the current username to the comment author username
					comment.author.username = req.user.username;
					//add the current user's name to the comment author's user name
					comment.author.name = req.user.name;
					//save the comment
					comment.save();
					//connect new comment to the poem
					foundPoem.comments.push(comment);
					//save the poem in the DB
					foundPoem.save();
					//redirect to SHOW Route
					res.redirect("/poems/" + foundPoem._id);
				}
			});
		}
	});
});

//EDIT ROUTE - /poems/:id/comments/:comment_id/edit
router.get("/poems/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	//Find the Poem By ID
	Poem.findById(req.params.id).populate("comments").exec((err, poem) => {
		if(err || !poem){
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
				//if poem found, then find the comment
				Comment.findById(req.params.comment_id, (err, foundComment) => {
				if(err){
					req.flash("error", "Comment Not Found");
					res.redirect("/poems");
				}else{
					//render the show page with the found comment
					res.render("poems/show", {foundComment: foundComment, poem: poem});
				}
			});	
		}
	});	
});

//UPDATE ROUTE - /poems/:id/comments/:comment_id
router.put("/poems/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, (err, updatedComment) => {
		if(err){
			console.log(err);
			res.redirect("/poems");
		}else{
			//Redirect to the show route
			res.redirect("/poems/" + req.params.id);
		}
	});
});

//REPLY ROUTE - /poems/:id/comments/:comment_id/reply
router.get("/poems/:id/comments/:comment_id/reply", (req, res) => {
	Poem.findById(req.params.id).populate("comments").exec((err, foundPoem) => {
		if(err || !foundPoem){
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
			Comment.findById(req.params.comment_id, (err, foundComment) => {
				if(err || !foundComment){
					req.flash("error", "Comment Not Found");
					res.redirect("/poems");
				}else{
					res.render("poems/show", {foundCommentForReply: foundComment, poem: foundPoem});
				}
			});
		}
	});
});

//REPLY POST ROUTE - /poems/:id/comments/:comment_id/reply
router.post("/poems/:id/comments/:comment_id/reply", middleware.isLoggedIn, (req, res) => {
	Poem.findById(req.params.id).populate("comments").exec(function(err, foundPoem){
		if(err || !foundPoem){
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
			var data = {title: req.body.title, author: req.user.name, author_id: req.user._id}
			Comment.findById(req.params.comment_id, (err, foundComment) => {
				if(err || !foundComment){
					req.flash("error", "Comment Not Found");
					res.redirect("/poems");
				}else{
					foundComment.replies.push(data);
					foundComment.save();
					//redirect to show route
					res.redirect("/poems/" + req.params.id);
				}
			});
		}
	});
});

//LIKES COMMENT POST ROUTE - /poems/:id/comments/:comment_id/likes
router.post("/poems/:id/comments/:comment_id/likes", middleware.isLoggedIn, (req, res) => {
	Poem.findById(req.params.id, (err, foundPoem) => {
		if(err || !foundPoem){
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
			Comment.findById(req.params.comment_id, (err, foundComment) => {
				if(err || !foundComment){
					req.flash("error", "Comment Not Found");
					res.redirect("/poems");
				}else{
					//check if the user has liked the post before
					let findUserLike = foundComment.likes.some(like => like.equals(req.user._id));
					//if user liked before, then remove the like
					if(findUserLike){
						//if the user already liked it before
						foundComment.likes.pull(req.user._id);	
					}else{
						//if the user didn't like before
						foundComment.likes.push(req.user._id);
					}
					//save the comment
					foundComment.save();
					//redirect to the show route
					res.redirect("/poems/" + req.params.id);
				}
			});
		}
	});
});

//DESTROY ROUTE - /poems/:id/comments/:comment_id
router.delete("/poems/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, err => {
		if(err){
			//Redirect to Homepage
			res.redirect("/poems");
		}else{
			Poem.findById(req.params.id, (err, foundPoem) => {
				if(err){
					req.flash("error", "Poem Not Found");
					res.redirect("/poems");
				}else{
					//deleting the comment id from comments array
					foundPoem.comments.pull(req.params.comment_id);
					//saving the poem
					foundPoem.save();
					//redirect to show route
					res.redirect("/poems/" + req.params.id);
				}
			});
		}
	});
});

module.exports = router;

const express 		= require("express");
const router 		= express.Router();
const Poem 		= require("../models/poem");
const middleware 	= require("../middleware");

router.post("/poems/:id/likes", middleware.isLoggedIn, (req, res) => {
	Poem.findById(req.params.id, (err, foundPoem) => {
		if(err){
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
			//check if the user has liked the post before
			let findUserLike = foundPoem.likes.some(like => like.equals(req.user._id));
			//check if the user has already disliked the post
			let findUserDislike = foundPoem.dislikes.some(dislike => dislike.equals(req.user._id));
			if(findUserDislike){
				//if user disliked the post, then remove the dislike
				foundPoem.dislikes.pull(req.user._id);
				//then add a like
				foundPoem.likes.push(req.user._id);
			}else if(findUserLike){
				//if the user already liked it before
				foundPoem.likes.pull(req.user._id);	
			}else{
				//if the user didn't like before
				foundPoem.likes.push(req.user._id);
			}
			//save the poem
			foundPoem.save();
			//console.log(foundPoem);
			//redirect to the index route
			res.redirect("/poems");
		}
	});
});

router.post("/poems/:id/dislikes", middleware.isLoggedIn, (req, res) => {
	Poem.findById(req.params.id, (err, foundPoem) => {
		if(err){
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
			//check if the user has already disliked the post
			let findUserDislike = foundPoem.dislikes.some(dislike => dislike.equals(req.user._id));
			//check if the user has liked the post before
			let findUserLike = foundPoem.likes.some(like => like.equals(req.user._id));
			if(findUserLike){
				//if user liked the post before, then remove the like
				foundPoem.likes.pull(req.user._id);
				//then add a dislike
				foundPoem.dislikes.push(req.user._id);
			}else if(findUserDislike){
				//if user disliked previously, then remove it
				foundPoem.dislikes.pull(req.user._id);
			}else{
				//if the user hasn't disliked before, then dislike it
				foundPoem.dislikes.push(req.user._id);
			}
			foundPoem.save();
			//console.log(foundPoem);
			//redirect to the index page
			res.redirect("/poems");
		}
	});
});

module.exports = router;

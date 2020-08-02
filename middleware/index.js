//All the middleware goes there
const Poem     		= require("../models/poem");
const Comment       = require("../models/comment");
let middlewareObj 	= {};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err || !foundComment){
				req.flash("error", "Comment Not Found");
				res.redirect("/poems");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permissions to do that");
					res.redirect("/poems");
				}
			}
		});
	}else{
		req.flash("error", "Please Login First");
	}
}

middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First");
	res.redirect("/login");
}

middlewareObj.isLoggedUserAdmin = (req, res, next) => {
	if(req.isAuthenticated()){
		if(req.user.name === "Ataur Rahaman"){
			next();
		}else{
			req.flash("error", "You don't have admin permissions");
			res.redirect("/poems");
		}
	}else{
		req.flash("error", "Please Login First");
	}
}

module.exports = middlewareObj;

const express 	= require("express");
const router 	= express.Router();
const passport 	= require("passport");
const User 		= require("../models/user");

//LANDING PAGE
router.get("/", (req, res) => {
	res.redirect("/poems");
});

//Show Registration Form
router.get("/register", (req, res) => {
	res.render("register");
});

//Logic for signup
router.post("/register", (req, res) => {
	let user = new User({username: req.body.username, name: req.body.name});
	User.register(user, req.body.password, (err, user) => {
		if(err){
			//console.log(err);
			//trying to add a user with an existing username
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			//After Login, redirect to homepage
			req.flash("success", "Successfully Signed Up! Nice to meet you " + req.user.name);
			res.redirect("/poems");
		});
	});
});

//Show login form
router.get("/login", (req, res) => {
	res.render("login");
});

//Logic for login
router.post("/login", passport.authenticate("local", {
		successRedirect: "/poems",
		failureRedirect: "/login"
	}), function(req, res){	
});

//Logic for logout
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have logged out successfully!!");
	res.redirect("/poems");
});

module.exports = router;
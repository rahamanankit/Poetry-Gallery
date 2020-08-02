const express 		= require("express");
const router	 	= express.Router();
const Poem 			= require("../models/poem");
const middleware 	= require("../middleware");

//INDEX ROUTE - GET - /poems
router.get("/poems", (req, res) => {
	Poem.find({}, (err, poems) => {
		if(err || !poems){
			req.flash("error", "Poems Not Found");
			res.redirect("/poems");
		}else{
			res.render("poems/index", {poems: poems});
		}
	});
});

//NEW ROUTE - GET - /poems/new - Render the Add Poem Form
router.get("/poems/new", middleware.isLoggedUserAdmin, (req, res) => {
	res.render("poems/new");
});

//CREATE ROUTE - POST - /poems
router.post("/poems", middleware.isLoggedUserAdmin, (req, res) => {
	//Getting the data from the poem array
	let newPoem = req.body.poem;
	Poem.create(newPoem, (err, addedPoem) => {
		if(err){
			//console.log("ERROR IN ADDING DATA TO DB!");
		}else{
			//Add the poem to the DB and then render it
			res.redirect("/poems");
		}
	});	
});

//EDIT ROUTE - GET - /poems/:id/edit
router.get("/poems/:id/edit", middleware.isLoggedUserAdmin, (req, res) => {
	Poem.findById(req.params.id, (err, editPoem) => {
		if(err || !editPoem){
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
			res.render("poems/edit", {poem: editPoem});
		}
	});
});

//UPDATE ROUTE - PUT - /poems/:id
router.put("/poems/:id", middleware.isLoggedUserAdmin, (req, res) => {
	let updatedData = req.body.poem;
	Poem.findByIdAndUpdate(req.params.id, updatedData, (err, updatedPoem) => {
		if(err){
			//console.log(err);
			req.flash("error", "Poem Not Found");
			res.redirect("back");
		}else{
			//If updated, then redirect to the Home Page
			res.redirect("/poems");
		}
	})
});

//SHOW ROUTE - GET - /poems/:id
router.get("/poems/:id", middleware.isLoggedIn, (req, res) => {
	Poem.findById(req.params.id).populate("comments").exec((err, foundPoem) => {
		if(err || !foundPoem){
			req.flash("error", "Poem Not Found");
			res.redirect("/poems");
		}else{
			//If found, then render the poem on show page
			res.render("poems/show", {poem: foundPoem});
		}
	});
});

//DESTROY ROUTE - DELETE - /poems/:id
router.delete("/poems/:id", middleware.isLoggedUserAdmin, (req, res) => {
	Poem.findByIdAndRemove(req.params.id, (err, deletedPoem) => {
		if(err){
			//console.log("ERROR IN DELETING POEM FROM DB");
		}else{
			console.log("Data deleted successfully!!");
			req.flash("success", "Poem was deleted successfully!!")
			res.redirect("/poems");
		}
	});
});

module.exports = router;
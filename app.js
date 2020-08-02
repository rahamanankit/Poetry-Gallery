const bodyParser 				= require("body-parser"),
	  methodOverride 			= require("method-override"),
	  mongoose   				= require("mongoose"),
	  express	   				= require("express"),
	  app        				= express(),
	  flash						= require("connect-flash"),
	  moment					= require("moment"),
	  passport					= require("passport"),
	  LocalStrategy   			= require("passport-local"), 
	  User 						= require("./models/user"),
	  seedDB          			= require("./seed");
	
//Requiring Routes
const commentRoutes     		= require("./routes/comment"),
	  poemRoutes 		  		= require("./routes/poem"),
	  likeDislikeRoutes 		= require("./routes/like_dislike"),
	  indexRoutes       		= require("./routes/index");

// APP CONFIG

//if environment variable is lost
const url = process.env.DATABASEURL || "mongodb://localhost/two_pages"
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//To seed the seed the DB
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret : "My Poem App",
	resave : false,
	saveUninitialized : false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.moment 	   = moment;
	res.locals.error 	   = req.flash("error");
	res.locals.success 	   = req.flash("success");
	next();
});

//Use the routes
app.use(indexRoutes);
app.use(commentRoutes);
app.use(poemRoutes);
app.use(likeDislikeRoutes);


//EXPRESS SERVER START!!
app.listen(process.env.PORT, process.env.IP, () => {
	console.log("SERVER IS RUNNING");
});
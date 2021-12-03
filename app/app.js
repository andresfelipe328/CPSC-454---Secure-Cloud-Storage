//dependencies 
var flash = require('connect-flash');
var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var path = require("path");


//variables 
//Connect to the database 
<<<<<<< HEAD
var mongoDB = `mongodb+srv://SlackerAira:7zUCH5zQH2@accountinfo.t4wtk.mongodb.net/test`;
=======
var mongoDB = `mongodb+srv://SlackerAira:<password>@accountinfo.t4wtk.mongodb.net/test`;
>>>>>>> f81464046ff8a2d3d73e85f14cf7e33c79064f6b

//connection events for mongodb 
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.log(error)).
	then(console.log("connected"));


var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(flash());

app.use(require("express-session")({
	secret: "secret",
	resave: false,
	saveUninitialized: false
}));

//passport stuff 
app.use(passport.initialize());
app.use(passport.session());

//passport-local stuff
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routing 

// Async in JS is technically multi threading but not multi threading since JS is single threaded, so async here is basically telling the system, hey, i'll get back to you later bro 
//Show home page 
//req = request 
//res = respond 
//app.METHODS are the HTML stuff like GET, POST and so forth 
app.get("/", function(req,res){
	res.render("home");
});

//show secret page (this is a test thing)
//Can replace with the download/upload page
//IsLoggedIn should show an error if you're not actually logged in
app.get("/secret", isLoggedIn, function(req,res) {
	res.render("secret")
});

// Show Register Form 
app.get("/register", function(req,res) {
	res.render("register");
});

// Handling the user signup 
// This works 
app.post("/register", function (req, res) {
    var username = req.body.username
    var password = req.body.password
    User.register(new User({ username: username }),
            password, function (err) {
        if (err) {
            console.log(err);
            return res.render("register");
        } else {
        	res.render("login");
        }
    });
});

// Show Login Form 
app.get("/login", function(req,res) {
	res.render("login");
});

// handle Login Form 
// passport handles the jazz basically 
// will try to figure out error handling later, kill me 
app.post("/login", function(req,res) {
	passport.authenticate('local', (err,user,info) => { 
	if (!user) {
		return res.render("login", {messages: "Failed to login in"});
	} else {
		return res.render("secret")
	}
})(req, res)
});


// Logout Suffering 
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Server has started, go to https://localhost or whatever and put in the port");
});
/* File Upload/Download/Delete by Andres*/
//***************************************************************************************************
// express required for the back end web server
const express = require('express');
// fileupload required to read files selected by the user
const fileupload = require("express-fileupload");
// uploadtoS3 required to perform the actual operations
const functsS3 = require("./Functs")
// fs required for file system related task
const fs = require('fs');
//***************************************************************************************************

/* Account Registration/Login by Kevin Nguyen*/
//***************************************************************************************************
//Storing messages to be displayed for users after events 
var flash = require('connect-flash');
//To be used for mongodb 
var mongoose = require("mongoose");
//Authentication purposes 
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var path = require("path");
//***************************************************************************************************

// Variables
const server = express();
var mongoDB = `mongodb+srv://SlackerAira:7zUCH5zQH2@accountinfo.t4wtk.mongodb.net/test`;
const port = 3000;

// Connection event 
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.log(error)).
    then(console.log("connected"));

// server can use express-fileupload
server.use(fileupload())

// Access to css and js files
server.use(express.static(__dirname));
server.use('/css', express.static(__dirname + '/css'));
server.use('/js', express.static(__dirname + '/js'));

// Access to the views and ejs stuff 
server.use(express.static(__dirname + '/public'));
server.set('views', './views');
server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({ extended: true}));

// Flash for message purposes 
server.use(flash());


//express-session stuff 
server.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

//passport stuff
server.use(passport.initialize());
server.use(passport.session());

//passport-local stuff 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// displays index.html
server.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// display account.ejs
server.get("/account", function(req, res) {
    res.render("account");
});

// display 
server.get("/secret", isLoggedIn, function(req,res) {
    res.sendFile(__dirname + '/index.html');
});

// Show Register Form 
server.get("/register", function(req,res) {
    res.render("register");
});

// Handling the user signup 
// This works 
// Can't figure out how to shove a parent folder in the s3 bucket for this purpose.  
server.post("/register", function (req, res) {
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
server.get("/login", function(req,res) {
    res.render("login");
});

// handle Login Form 
// passport handles the jazz basically 
server.post("/login", function(req,res) {
    passport.authenticate('local', (err,user,info) => { 
    if (!user) {
        return res.render("login", {messages: "Failed to login in"});
    } else {
        res.sendFile(__dirname + '/index.html', {messages: "Successfully Logged In"});
    }
})(req, res)
});




// Logout Suffering 
server.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}



// Handles post to upload a file
server.post('/upload', (req, res) => {
    if (req.files) {
        // gets the file and its information
        var file = req.files.userFile;
        // retrieves the file's name
        var fileName = file.name;
        // retrieves the file's contents
        var fileContent = file.data;
        // access the uploadFile method to upload to S3
        functsS3.uploadFile(fileName,fileContent,'user1Folder/', "password");
        res.send("File uploaded")
    }
});


// Handle post to download a file
server.post('/download', (req, res) => {
    userFile = req.body.userFile;
    functsS3.ProvideList('user1Folder/');
    fileList = functsS3.List;
    console.log("In server " + fileList);
    //functsS3.downloadFile(userFile, 'user1Folder/', 'password');
    res.send("File downloaded")
});


// Handle post to download a file
server.post('/delete', (req, res) => {
    userFile = req.body.userFile;
    
    functsS3.deleteFile(userFile, 'user1Folder/');
    res.send("File deleted")
});


// Listen to localhost in port 3000
server.listen(port, () => console.info('Listening...'));
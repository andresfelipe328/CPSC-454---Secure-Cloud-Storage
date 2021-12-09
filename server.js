/* File Upload/Download/Delete/Disp by Andres*/
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
var parentFolder = "";
var loggedIn = 0;
var constVals = [];

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


/* Handling the user signup 
 This works 
 Can't figure out how to shove a parent folder in the s3 bucket for this purpose.  
*/ 
server.post("/register", function (req, res) {
    // Variables
    var username = req.body.username
    var password = req.body.password;

    // Create parent folder for user
    functsS3.ProduceFolder(username + 'Folder/');
    // Register user
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


/*
setParentFoder is an async function that makes sure to record the parent folder name of 
user that logged in. All services will based on this folder
    Input: parentName :string

    Output: p :promise
*/
async function setParentFolder (parentName) {
    // makes a new proimse of an asynchronous operation and its resulting value
    var p = new Promise(function(resolve, reject){
        parentFolder = parentName + 'Folder/'
        loggedIn = 1;
        constVals.push(parentFolder, loggedIn);
        resolve(constVals);
          });
    // returns promise
    return p;
};


// Show Login Form 
server.get("/login", function(req,res) {
    res.render("login");
});

// handle Login Form 
// passport handles the jazz basically 
server.post("/login", function(req,res) {
    passport.authenticate('local', (err,user,info) => { 
    if (!user) {
        return res.render("login", {messages: "Failed to login in or not registered"});
    } else {
        res.sendFile(__dirname + '/index.html', {messages: "Successfully Logged In"});
        // Handles the assignation of parent Folder
        parentFolder = setParentFolder(req.body.username);
        parentFolder.then(function(result){
        parentFolder = result[0];
    });
    }
})(req, res)
});


/*
notLoggedIn reseets vaue loggedIn to make sure user logins first to use services
*/
async function notLoggedIn () {
    // makes a new proimse of an asynchronous operation and its resulting value
    var p = new Promise(function(resolve, reject){
        loggedIn = 0;
        resolve(loggedIn);
          });
    // returns promise
    return p;
};


// Logout Suffering 
server.get("/logout", function(req, res) {
    req.logout();
    notLoggedin = notLoggedIn();
        notLoggedin.then(function(result){
        loggedIn = 0;
    });
    res.redirect("/");
});

// Makes sure user is logged in
function isLoggedIn(req, res, next) {
    // checks if the user is logged in
    if (loggedIn == 1){
        return next();
    }
    // return to login page
    else
    res.redirect("/login");
}


// Handles post to upload a file
server.post('/upload',isLoggedIn, (req, res) => {
    if (req.files) {
        // gets the file and its information
        var file = req.files.userFile;
        // retrieves the file's name
        var fileName = file.name;
        // retrieves the file's contents
        var fileContent = file.data;
        // access the uploadFile method to upload to S3
        functsS3.uploadFile(fileName,fileContent, parentFolder, "password");
        res.send("File uploaded")
    }
});


// Handle post to download a file
server.post('/download', isLoggedIn, (req, res) => {
    userFile = req.body.userFile;
    functsS3.downloadFile(userFile, parentFolder, 'password');
    res.send("File downloaded")
});


// Handle post to delete a file
server.post('/delete', isLoggedIn, (req, res) => {
    userFile = req.body.userFile;
    functsS3.deleteFile(userFile, parentFolder);
    res.send("File deleted")
});


// Handle post to display list of files
server.post('/disp', isLoggedIn, (req, res) => {
    // Variable
    var content;
    console.log(parentFolder)
    // Calls function that returns promise (contains the files)
    const fileList = functsS3.ProvideList(parentFolder);
    // This is when promise is returned and the contents is sent
    fileList.then(function(result){
        content = result;
        res.send(content)
    });
});


// Listen to localhost in port 3000
server.listen(port, () => console.info('Listening...'));
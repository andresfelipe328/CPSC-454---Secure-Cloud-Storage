// express required for the back end web server
const express = require('express');
// fileupload required to read files selected by the user
const fileupload = require("express-fileupload");
// uploadtoS3 required to perform the actual operations
const functsS3 = require("./Functs")
// fs required for file system related task
const fs = require('fs');

// Variables
const server = express();
const port = 3000;

// server can use express-fileupload
server.use(fileupload())

// Access to css and js files
server.use(express.static(__dirname));
server.use('/css', express.static(__dirname + '/css'));
server.use('/js', express.static(__dirname + '/js'));

// displays index.html
server.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


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
    functsS3.downloadFile(userFile, 'user1Folder/', 'password');
    res.send("File downloaded")
});


// Handle post to download a file
server.post('/delete', (req, res) => {
    userFile = req.body.userFile;
    
    functsS3.deleteFile(userFile, 'user1Folder/');
    res.send("File deleted")
});


// Handle post to download a file
server.post('/disp', (req, res) => {
    // Variable
    var content;

    // Calls function that returns promise (contains the files)
    const fileList = functsS3.ProvideList('user1Folder/');
    // This is when promise is returned and the contents is sent
    fileList.then(function(result){
        content = result;
        res.send(content)
    });
});


// Listen to localhost in port 3000
server.listen(port, () => console.info('Listening...'));
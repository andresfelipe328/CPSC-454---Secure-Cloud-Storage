// fs required for file system related tasks
const fs = require('fs');
// AWS required to access AWS's components in js
const AWS = require('aws-sdk');
// AES required to encrypt and decrypt user data
const AES = require("./aes256.js")
/*
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
*/

var exports = module.exports = {};
var fileList = [];

/*
s3 represents the S3 bucket instance, it requires the access key ID and the secret key.
Through this, upload, download (getObject), and delete processes will be possible
*/
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


/*
ProvideList receives the parent folder and uses it to list all files and subfolders 
located inside the parent folder
    Input:  parentFolder :string

    Output: N/A
*/
exports.ProvideList = ProvideList = (parentFolder) => {
    const params = {
        Bucket: 'securecloudstorage',
        //Delimiter: '/',
        Prefix: parentFolder
    };
    s3.listObjects(params, (s3Err, data) => {
        // handle error
        if (s3Err)
            console.log(s3Err.message);
        else {
            data.Contents.forEach(function(obj,index){
                fileList.push(obj.Key);
            });
            //console.log("In Functs " + fileList)
            exports.List = fileList;
            //console.log(exports);
            return fileList;
        }
    });
};


/*
uploadFile receives the fileName, parent folder, and password for AES. File content is
read and then it's encrypted and uploaded to the user's parent folder
    Input:  fileName :string
            parentFolder :string
            password :string

    Output: N/A
*/  
exports.uploadFile = uploadFile = (fileName, fileContent, parentFolder, password) => {
    // Variable
    const filePath = parentFolder.concat(fileName);

    // open file and read contents by using fs
    // const FileContent = fs.readFileSync(filePath);
    // provide the unique password key and a 16-byte string used as salt
    key = AES.getKeyFromPassword(password, "reallylongsalter");
    // run encryption algorithm using the encryption key and salt string
    cipherContent = AES.encrypt(fileContent.toString('hex'), key);

    // acquire the information needed to connect to the s3 bucket and the data to be sent
    const params = {
        Bucket: 'securecloudstorage',
        Key: filePath,
        Body: cipherContent
    };
    // run upload to transfer the data to the bucket by using AWS-SDK
    s3.upload(params, function(s3Err, data) {
        // handle error
        if (s3Err) 
            console.log(s3Err.message);
        else
            console.log("File Successfully Uploaded!");
    });
};


/*
downloadFile receives the fileName, parent folder, and password for AES. File content is
received from s3 bucket and stored in a new file under the download folder
    Input:  fileName :string
            parentFolder :string
            password :string

    Output: N/A
*/
exports.downloadFile = downloadFile = (fileName, parentFolder, password) => {
    // Variables
    const filePath = parentFolder.concat(fileName);
    const newFile = "new_";
    const folder = "download/";
    const downloadFile = newFile.concat(fileName);
    const downloadPath = folder.concat(downloadFile);
    
    if (!fs.existsSync(folder)){
        fs.mkdirSync(folder);
    }

    // provide the unique password key and a 16-byte string used as salt
    key = AES.getKeyFromPassword(password, "reallylongsalter");
    // acquire the information needed to connect to the s3 bucket and the file's name
    const params = {
        Bucket: 'securecloudstorage',
        Key: filePath
    };
    // run getObject to fetch the file's content from the s3 bucket
    s3.getObject(params, (s3Err, data) => {
        // handle error
        if (s3Err)
            console.log(s3Err.message);
        else
            // run encryption algorithm using the encryption key and only the data's body
            plainText = AES.decrypt(data.Body, key, true);
            // write the plaintext into a file under download folder by using fs
            fs.writeFileSync(downloadPath, plainText);
            //console.log(plainText.toString())
            console.log("File Successfully Downloaded!");
    });
  };
 

/*
deleteFile receives the fileName, and parent folder. By using the path to the file, it is
deleted in the s3 bucket.
    Input:  fileName :string
            parentFolder :string

    Output: N/A
*/
exports.deleteFile = deleteFile = (fileName, parentFolder) => {
    // Variable
    const filePath = parentFolder.concat(fileName);

    // acquire the information needed to connect to the s3 bucket and the file's name
    const params = {
        Bucket: 'securecloudstorage',
        Key: filePath
    };
    // run deleteObject to delete the file according to the file's path
    s3.deleteObject(params, function(s3Err, data) {
        // hadle error
        if (s3Err) 
            console.log(s3Err.message);
        else    
        console.log("File Successfully Deleted!");
    });
  }; 


// ====================================================================================== //
/*
For the pupose of this file, one sets the filename, parentFolder, and password. Then, it's
run and user selects actions: upload, download, or delete. In reality, this file should 
receive the filename, parentfolderer, and password
*/
/*
var filename = "test.txt";
var parentFolder = "user1Folder/";
var password = "password";

readline.question(`What do you want to do?`, resp => {
    readline.close()
    if (resp == "upload"){
        uploadFile(filename, filename, parentFolder, password);
    }
    else if (resp == "download"){
        downloadFile(filename, parentFolder, password);
    }
    else if (resp == "delete"){
        deleteFile(filename, parentFolder);
    }
    else
        ProvideList(parentFolder);
})*/
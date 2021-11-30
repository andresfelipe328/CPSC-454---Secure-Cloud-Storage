const fs = require('fs');
const AWS = require('aws-sdk');
const AES = require("./aes256.js")
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync(fileName);
    key = AES.getKeyFromPassword("password", "reallylongsalter");
    cipherContent = AES.encrypt(fileContent.toString('binary'), key);
    const params = {
        Bucket: 'securecloudstorage',
        Key: fileName,
        Body: cipherContent
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log("success");
    });
};
  
  const downloadFile = (fileName) => {
    key = AES.getKeyFromPassword("password", "reallylongsalter");
    const params = {
        Bucket: 'securecloudstorage',
        Key: fileName
    };
    s3.getObject(params, (err, data) => {
        if (err) console.error(err);
        plainText = AES.decrypt(data.Body, key)
        fs.writeFileSync("./download/downloaded.txt", plainText.toString());
        console.log("success");
    });

  };
 
  const deleteFile = (fileName) => {
    const params = {
        Bucket: 'securecloudstorage',
        Key: fileName
    };
    s3.deleteObject(params, function(err, data) {
        if (err) 
            console.log(err, err.stack);
        else    
        console.log("File Successfully Deleted!");
    });
  }; 

readline.question(`What do you want to do?`, resp => {
    readline.close()
    if (resp == "upload"){
        uploadFile("test.txt")
    }
    else if (resp == "download"){
        downloadFile("test.txt")
    }
    else {
        deleteFile("test.txt")
    }
})

# Execution

* Download aws-sdk by typing -> npm install aws-sdk
* Export the AWS KEYID and AWS SECRET KEY by typing:
  1. export AWS_ACCESS_KEY=
  2. export AWS_SECRET_ACCESS_KEY=

* Currently, the file is set in the code, so make sure the name of the file is the same as the one in the code. Also, have a download folder
* Run V2upload.js by typing -> node V2upload.js
* Input upload, download, or delete
* Results will be in the AWS S3 bucket.

Note: You'll need the KEYID and SECRET_KEY from me, so contact me

# Description 

* Code is split into separate categories and don't interfere with each other 
  1. The Registration/Login portion 
  2. The file uploading 

# Account

* Registration and Logging in is handled in this section 
* Also able to logout by destroying the session 
* Uses mongoDB to handle the data for accounts 

# Secure Storage 

* Uses the AES256.js to encrypt the stuff 
* Upload file will be encrypted before sending 
* Download the file will be decrypted before downloading 
* Delete is delete and will delete from s3 bucket 

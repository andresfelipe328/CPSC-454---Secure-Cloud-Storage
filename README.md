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

* Dependencies used are in the package.json 
* "aws-sdk": "^2.1044.0",
* "body-parser": "^1.19.0",
* "connect-flash": "^0.1.1",
* "ejs": "^3.1.6",
* "express": "^4.17.1",
* "express-fileupload": "^1.2.1",
* "express-session": "^1.17.2",
* "expressjs": "^1.0.1",
* "mongoose": "^6.1.0",
* "multer": "^1.4.3",
* "passport": "^0.5.0",
* "passport-local": "^1.0.0",
* "passport-local-mongoose": "^6.1.0"

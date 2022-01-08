# CPSC-454: Secure Cloud Storage
Implementation of AES-256 for enc/decryption of files in a file transfer system on the cloud

## Team Member Information:
* Andres F. Romero
* Vincent P. Rodriguez
* Kevin Nguyen
* Ares Hamilton
* Vincent Nguyen

##Dependencies:
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

##Execution (assuming the tester is a new user):
	1. go to the directory that has all the files through terminal 
	2. install aws-sdk -> npm install aws-sdk
	3. install nodemon -> npm install nodemon
	4. export the needed credentials for connecting with AWS by inputing in terminal (this is secret)
		* export AWS_ACCESS_KEY_ID=AKIARPY2ZGX6K3UWYXVY
		* export AWS_SECRET_ACCESS_KEY=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
	5. start server -> npm start
	6. Open browser and input localhost:3000
	7. Click on "Register" and input a username and password
	8. Click on "Home" and then on "Login". Provide the username and password
	9. From here you have four functionalities:
		1. Upload: click on "browse" and click on "Upload"
		2. Download: enter the exact name of file with extension and click "Download"
		3. Delete: enter the exavt name of file with extension and click "Delete"
		4. Files: click "Display" and a json dump will be shown
		NOTE: All of these functionalities take you to another page displaying confirmation. Go back
			and click on the pop up, click "x" at the top right corner.
	Extra: "Account" will let you logout, you'll have to login again to use functionalities

##Proof of Successful Actions:
	* MongoDB:
		1. Download the program MongoDB Compass
		2. using this string for connection string: 'mongodb+srv://SlackerAira:7zUCH5zQH2@accountinfo.t4wtk.mongodb.net/test'
			Note: This may not work because it's a free cluster. Creator of this cluster may have to reset it. Contact 
			Kevin Nguyen (kevinn4065@csu.fullerton.edu) or Andres Romero (andresfelipe328@csu.fullerton.edu)
		3. Click "test" -> "users"
	* AWS:
		1. Go to AWS
		2. click "sign in to the console" in the top right corner
		3. Select IAM user
		4. Enter this credentials (password is secret):
			1. 12 Digit ID: 102598522364
			2. IAM user name: cloudstorageUser
			3. password: cpsc454_password
		5. In the search bar input S3
		6. click on securecloudstorage
		7. you'll see the folders for users and inside you'll see the files.
			NOTE: click on the object, file, and click on the object URL to download it. If its an image, mp4, or mp3, you
				wont be able to open because it's encrypted. Text files will give you more visible proof

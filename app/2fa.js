// needed to use speakeasy library
const speakeasy = require('speakeasy')
const qrcode = require('qrcode');
const user = require('./models/user');

// needed for testing in terminal
const readline = require('readline').createInterface({input: process.stdin, output: process.stdout});

// generates a secret key
function enable2FA(username) {
    var key = speakeasy.generateSecret({
        name: username 
    })

    return key;
}

// checks given code for verification
function verify2FA(code, key) {
    var passed = speakeasy.totp.verify({
        secret: key.base32,
        encoding: 'base32',
        token: code
    })
    return passed;
}


var test = "test"
testKey = enable2FA(test)

var promptLoop = function() {
    readline.question('\nEnter the correct token obtained from the authenticator app or type "exit" to quit:', input => {
        if (input == 'exit') return readline.close();

        // checks input against key
        var testVerification = speakeasy.totp.verify({
            secret: testKey.base32,
            encoding: 'base32',
            token: input
        })
            
        if (testVerification == true) console.log("\nVerification passed\n")
        else console.log("\nVerification failed\n");

        promptLoop();
    });
};

qrcode.toDataURL(testKey.otpauth_url, function(err, data){

    //gives link to QR code
    console.log('\nGenerated QR code:\n', data, '\n')

    // brings up the prompt for the token
    process.nextTick(() => {
        promptLoop();
    })
})

// exporting these functions
module.exports = { enable2FA, verify2FA };
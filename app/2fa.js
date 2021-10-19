// needed to use speakeasy library
const speakeasy = require('speakeasy')
const qrcode = require('qrcode');
const user = require('./models/user');

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

//TODO: integrate this with the actual signup/login

// testing this out, delete later
var test = "test"
testKey = enable2FA(test)
console.log(testKey)
qrcode.toDataURL(testKey.otpauth_url, function(err, data){
    console.log(data)
})
var testVerification = speakeasy.totp.verify({
    secret: 'HIXGGYLDKFWSM7KOMVBESMZMHNDWOT3HFZYGM4SAOVYDMTJOGBEA',
    encoding: 'base32',
    token: '615415'
})
console.log(testVerification);

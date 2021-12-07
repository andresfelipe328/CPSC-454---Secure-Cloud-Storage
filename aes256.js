const crypto = require('crypto');

var exports = module.exports = {};

const CyAlgo = {
    BLOCK_CIPHER: 'aes-256-gcm',
    AUTH_TAG_BYTE_LEN: 16,
    IV_BYTE_LEN: 12,
    KEY_BYTE_LEN: 32,
    SALT_BYTE_LEN: 16
}

const getIV = () => crypto.randomBytes(CyAlgo.IV_BYTE_LEN);
exports.getRandomKey = getRandomKey = () => crypto.randomBytes(CyAlgo.KEY_BYTE_LEN);

exports.getSalt = getSalt = () => crypto.randomBytes(CyAlgo.SALT_BYTE_LEN);
exports.getKeyFromPassword = getKeyFromPassword = (password, salt) => {
    return crypto.scryptSync(password, salt, CyAlgo.KEY_BYTE_LEN);
}

exports.encrypt = encrypt = (messagetext, key) => {
    //console.log(messagetext);
    const iv = getIV();
    //console.log(iv);
    const cipher = crypto.createCipheriv(
        CyAlgo.BLOCK_CIPHER, key, iv,
        { 'authTagLength': CyAlgo.AUTH_TAG_BYTE_LEN });
    let encryptedMessage = cipher.update(messagetext);
    //console.log(encryptedMessage);
    encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
    //console.log(encryptedMessage);
    return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()]);
}

exports.decrypt = decrypt = (ciphertext, key) => {
    //console.log(ciphertext);
    const authTag = ciphertext.slice(-CyAlgo.AUTH_TAG_BYTE_LEN);
    //console.log(authTag);
    const iv = ciphertext.slice(0, CyAlgo.IV_BYTE_LEN);
    //console.log(iv);
    const encryptedMessage = ciphertext.slice(CyAlgo.IV_BYTE_LEN, -CyAlgo.AUTH_TAG_BYTE_LEN);
    //console.log(encryptedMessage);
    const decipher = crypto.createDecipheriv(
        CyAlgo.BLOCK_CIPHER, key, iv,
        { 'authTagLength' : CyAlgo.AUTH_TAG_BYTE_LEN });
    decipher.setAuthTag(authTag);
    let messagetext = decipher.update(encryptedMessage);
    //console.log(messagetext);
    messagetext = Buffer.concat([messagetext, decipher.final()]);
    //console.log(messagetext);
    return Buffer.from(messagetext.toString('binary'), 'hex');
}
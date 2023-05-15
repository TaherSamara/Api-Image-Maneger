// exports all module in modules folder
module.exports = {
    createAuthToken:require('./createAuthToken'),
    uniqueniss:require('./uniqueniss'),
    getUser:require('./getUserByEmail'),
    generateRandNum:require('./generateRandomNumber'),
    getUserByVerifCode:require('./getUserByverifCode'),
    getUserByToken:require('./getUserByToken'),
    upload:require('./uploadImage'),
    getUrlImage:require('./getImage'),
    oneHourLater:require('./oneHourLater'),
}
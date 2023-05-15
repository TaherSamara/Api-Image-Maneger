const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // one hour for destroy_token

module.exports = oneHourLater;
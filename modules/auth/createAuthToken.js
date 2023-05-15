const jwt = require('jsonwebtoken');

// create Token
const createAuthToken = (userName, req, res) => {
  
  return new Promise((resolve, reject) => {
    jwt.sign({ userName }, "secretkey", { expiresIn: "1d" }, (unAuth, token) => {
      if (unAuth) {
        reject(unAuth);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = createAuthToken;

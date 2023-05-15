var { Userdb } = require("../../server/model");

const getUserByverifCode = async (verifCode) => {
  try {
    const user = await Userdb.findOne({verification_code: verifCode});
    console.log(user);
    if (user) {
      return user;
    } else {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = getUserByverifCode;

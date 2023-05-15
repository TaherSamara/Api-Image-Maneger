var { Userdb } = require("../../server/model");

const getUser = async (token) => {
  try {
    const user = await Userdb.findOne({token: token});
    if (user) {
      return user;
    } else {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = getUser;

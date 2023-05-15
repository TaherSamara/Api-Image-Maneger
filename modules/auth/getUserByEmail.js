var { Userdb } = require("../../server/model");

const getUser = async (email) => {
  try {
    const user = await Userdb.findOne({email: email});
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

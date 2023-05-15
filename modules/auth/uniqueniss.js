var { Userdb } = require("../../server/model");

const uniqueniss = async (user_name, email) => {
  try {
    const user = await Userdb.findOne({
      $or: [{ user_name: user_name }, { email: email }],
    });
    if (!user) {
      return true;
    } else {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = uniqueniss;

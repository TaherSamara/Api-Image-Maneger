const { Userdb } = require("../model");
const bcrypt = require("bcrypt");
const {
  createAuthToken,
  uniqueniss,
  getUser,
  generateRandNum,
  getUserByVerifCode,
  getUserByToken,
  upload,
  getUrlImage,
  oneHourLater,
} = require("../../modules/auth");

exports.register = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: "Failed to upload file" });
    }
    const user_name = req.body.user_name;
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    const imgName = req.file.filename;
    try {
      const unique = await uniqueniss(user_name, email);
      const createToken = await createAuthToken(req.body.user_name, req, res); // create token

      if (unique && password == confirm_password) {
        const hashedPassword = await bcrypt.hash(password, 10); // hash the password

        const user = new Userdb({
          full_name: req.body.full_name,
          user_name: req.body.user_name,
          email: req.body.email,
          phone: "",
          pic_url: imgName,
          token: createToken,
          created_token: Date.now(),
          destroy_token: oneHourLater,
          password: hashedPassword,
        });
        await user.save();
        res.status(200).send();
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      res.sendStatus(400);
    }
  });
};

exports.login = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await getUser(email);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!user || !passwordMatch) {
      res.sendStatus(400);
    }
    const createToken = await createAuthToken(user.user_name, req, res); // create token
    // Update the document
    const filter = { _id: user._id }; // Specify the Uesr ID
    const update = {
      $set: {
        token: createToken,
        created_token: Date.now(),
        destroy_token: oneHourLater,
      },
    };
    const result = await Userdb.updateOne(filter, update);
    const dataUpdated = {
      authToken: update["$set"]["token"],
      refreshToken: "refreshToken",
      expiresIn: update["$set"]["destroy_token"],
    };
    if (result.modifiedCount == 1) {
      res.status(200).send(dataUpdated);
      return;
    }
    throw err;
  } catch (err) {
    res.status(400).send();
  }
};

exports.forgetPassword = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const email = req.body.email;
    const user = await getUser(email);
    if (!user) {
      res.sendStatus(400);
    }

    const verifCode = generateRandNum().toString();

    // Update the document
    const filter = { _id: user._id }; // Specify the Uesr ID
    const update = {
      $set: {
        verification_code: verifCode,
      },
    };
    const result = await Userdb.updateOne(filter, update);
    if (result) {
      console.log(verifCode);
      res.status(200).send(verifCode);
    }
    throw err;
  } catch (err) {
    res.status(400).send();
  }
};

exports.resetPassword = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const password = req.body.password;
    const confirm_password = req.body.confirmPassword;
    const verifCode = req.body.verificationCode;
    const user = await getUserByVerifCode(verifCode);
    if (confirm_password != password) {
      res.sendStatus(400);
    }
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password
    // Update the document
    const filter = { _id: user._id }; // Specify the Uesr ID
    const update = {
      $set: {
        password: hashedPassword,
      },
    };
    const result = await Userdb.updateOne(filter, update);
    if (result) {
      res.status(200).send({ message: "The password has been reset successfully" });
    }
    throw err;
  } catch (err) {
    res.status(400).send();
  }
};

// retuen information for the user when login
exports.me = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const user = await getUserByToken(req.body.token);
    const picUrl = getUrlImage(user.pic_url);

    const userData = {
      id: user._id,
      fullname: user.full_name,
      username: user.user_name,
      email: user.email,
      phone: "",
      is_new_user: false,
      picUrl: picUrl,
    };
    res.status(200).send(userData);
  } catch (error) {
    res.status(400).send();
  }
};

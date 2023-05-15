var { Folderdb } = require("../model");
var { checkType, upload, deleteFolderAndChildren } = require("../../modules/folder");

// add folder
exports.addFolder = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const folder = new Folderdb({
      name: req.body.name,
      parent_id: req.body.parent_id,
      type: 1,
      pic_name: "",
      pic_size: "",
      description: "",
      user_id: req.body.user_id,
    });
    await folder.save();
    res.status(200).send();
  } catch (err) {
    res.status(400).json({
      message: err.message || "Some error occurred while creating the Folder.",
    });
  }
};

// add images
exports.addImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: "Failed to upload file" });
    }
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    try {
      const len = req.files.length;
      for (let i = 0; i < len; i++) {
        const folder = new Folderdb({
          name: req.files[i].originalname,
          parent_id: req.body.parent_id,
          type: 2,
          pic_name: req.files[i].filename,
          pic_size: req.files[i].size,
          description: req.body.description,
          user_id: req.body.user_id,
        });
        await folder.save();
      }
      res.status(200).send();
    } catch (err) {
      res.status(400).json({
        message:
          err.message || "Some error occurred while creating the Folder.",
      });
    }
  });
};

// get all fields from the folders collections in home page
exports.list = async (req, res) => {
  try {
    if (req.params.id && req.query.type) {
      const id = req.params.id; // user id
      const type = checkType(req.query.type);
      const q = req.query.q;
      const page = parseInt(req.query.page) || 1; // page number, default to 1
      const size = parseInt(req.query.size) || 10; // number of items per page, default to 10
      const skipIndex = (page - 1) * size; // calculate index of the first item to return
      if (type == 0) {
        // Filter folders by id, and name containing q
        var folders = await Folderdb.find({
          user_id: id,
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
          parent_id: "0", // 0 for home page
        })
          .sort({ _id: -1 }) // Sort by createdAt field in descending order
          .skip(skipIndex)
          .limit(size)
          .exec();
        var count = await Folderdb.countDocuments({
          user_id: id,
          parent_id: "0", // 0 for home page
        });
      } else {
        // Filter folders by id, type, and name containing q
        var folders = await Folderdb.find({
          user_id: id,
          type: type,
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
          parent_id: "0", // 0 for home page
        })
          .sort({ _id: -1 }) // Sort by createdAt field in descending order
          .skip(skipIndex)
          .limit(size)
          .exec();
        var count = await Folderdb.countDocuments({
          user_id: id,
          type: type,
          parent_id: "0", // 0 for home page
        });
      }
      var allFolders = [];
      const record = folders.length;
      for (let i = 0; i < record; i++) {
        var dataFolder = {
          id: folders[i]._id,
          name: folders[i].name,
          parent_id: folders[i].parent_id,
          type: folders[i].type,
          pic_name: folders[i].pic_name,
          pic_size: folders[i].pic_size,
          description: folders[i].description,
        };
        allFolders.push(dataFolder);
      }
      res.status(200).send({ count, record, data: allFolders });
    }
  } catch (err) {
    res.status(400).send();
  }
};

// get all fields from the folders collections have a parnet id
exports.list2 = async (req, res) => {
  try {
    if (req.params.id && req.query.type) {
      const id = req.params.id; // user id
      const type = checkType(req.query.type);
      const q = req.query.q || "";
      const parent_id = req.query.parent_id;
      const page = parseInt(req.query.page) || 1; // page number, default to 1
      const size = parseInt(req.query.size) || 6; // number of items per page, default to 10
      const skipIndex = (page - 1) * size; // calculate index of the first item to return
      if (type == 0) {
        // Filter folders by id, and name containing q
        var folders = await Folderdb.find({
          user_id: id,
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
          parent_id: parent_id,
        })
          .sort({ _id: -1 }) // Sort by createdAt field in descending order
          .skip(skipIndex)
          .limit(size)
          .exec();
        var count = await Folderdb.countDocuments({
          user_id: id,
          parent_id: parent_id,
        });
      } else {
        // Filter folders by id, type, and name containing q
        var folders = await Folderdb.find({
          user_id: id,
          type: type,
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
          parent_id: parent_id,
        })
          .sort({ _id: -1 }) // Sort by createdAt field in descending order
          .skip(skipIndex)
          .limit(size)
          .exec();
        var count = await Folderdb.countDocuments({
          user_id: id,
          type: type,
          parent_id: parent_id,
        });
      }
      var allFolders = [];
      const record = folders.length;
      for (let i = 0; i < record; i++) {
        var dataFolder = {
          id: folders[i]._id,
          name: folders[i].name,
          parent_id: folders[i].parent_id,
          type: folders[i].type,
          pic_name: folders[i].pic_name,
          pic_size: folders[i].pic_size,
          description: folders[i].description,
        };
        allFolders.push(dataFolder);
      }
      res.status(200).send({ count, record, data: allFolders });
    }
  } catch (err) {
    res.status(400).send();
  }
};

// find one by id : image or folder
exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    const folder = await Folderdb.findById(id);
    var data = {
      id: folder._id,
      name: folder.name,
      parent_id: folder.parent_id,
      type: folder.type,
      pic_name: folder.pic_name,
      pic_size: folder.pic_size,
      description: folder.description,
    };
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send();
  }
};

// rename folder or image
exports.rename = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const id = req.params.id;
    const newName = req.query.newName;
    // const folder = await getFolder(id);
    const filter = { _id: id };
    const update = {
      $set: {
        name: newName,
      },
    };
    const result = await Folderdb.updateOne(filter, update);
    if (result) {
      return res.status(200).send();
    }
    throw err;
  } catch (error) {
    res.status(400).send();
    return;
  }
};

// delete API 
exports.delete = async (req, res) => {
  try {
    const selected = req.body.selected;
    const folderIds = eval(selected); // parse the string as an array

    // Delete each folder and its children
    for (let i = 0; i < folderIds.length; i++) {
      const folderId = folderIds[i];
      await deleteFolderAndChildren(folderId);
    }

    res.status(200).send({ message: "Folders deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// to change directory for images and folders
exports.move = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  try {
    var selectedId = req.body.selected;
    const newParent_id = req.params.id;
    selectedId = eval(selectedId); // parse the string as an array
    for (let i = 0; i < selectedId.length; i++) {
      const filter = { _id: selectedId[i] };
      const update = {
        $set: {
          parent_id: newParent_id,
        },
      };
      await Folderdb.updateOne(filter, update);
    }

    res.status(200).send({ message: "Folders updated successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
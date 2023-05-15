const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

var schema = new mongoose.Schema({
    name: {
        type: String
    },
    parent_id: {
        type: String
    },
    // 0 -> image + folder , 1 -> fodler , 2 -> images
    type: {
        type: Number
    },
    pic_name: {
        type: String
    },
    pic_size: {
        type: String
    },
    description: {
        type: String
    },
    user_id: {
        type: ObjectId
    },
});

const Folderdb = mongoose.model('folder', schema);

module.exports = Folderdb;

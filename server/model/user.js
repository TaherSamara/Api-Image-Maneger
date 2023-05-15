const { default: mongoose } = require("mongoose");

var schema = new mongoose.Schema({
    full_name:{
        type:String
    },
    user_name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    pic_url:{
        type:String
    },
    token:{
        type:String
    },
    created_token:{
        type:Date
    },
    destroy_token:{
        type:Date
    },
    verification_code:{
        type:String
    },
    password:{
        type:String   
    }
});

const Userdb = mongoose.model('user',schema);

module.exports = Userdb;

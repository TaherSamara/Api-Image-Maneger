const express = require("express");

//the next line rahter than --const app = express();-- cause will create new app if used it
const route = express.Router(); 
// now: rather than use -app.get()....;- will use route.get()

// get all routs form services
const services = require('../services/render');

// get all routs -API- form FolderController
const {folderController} = require('../controller');

// get all routs -API- form AuthController
const {authController} = require('../controller');
  

/**
 * @description Root Route
 * @method GET /
 */
route.get('/',services.homeRotes);



//API

// ==================================AUTH--API====================================== 
 route.post('/auth/register',authController.register);
 route.post('/auth/login',authController.login);
 route.post('/auth/me',authController.me);
 route.post('/auth/forgot-password',authController.forgetPassword);
 route.post('/auth/reset-password',authController.resetPassword);
// ==================================AUTH--API======================================


// ==================================FOLDERS--API======================================
route.post('/folder/add-image',folderController.addImage);
route.post('/folder/add-folder',folderController.addFolder);
route.get('/folder/:id/list1',folderController.list);
route.get('/folder/:id/list2',folderController.list2);
route.get('/folder/:id/get',folderController.get);
route.post('/folder/:id/edit',folderController.rename);
route.post('/folder/delete',folderController.delete);
route.post('/folder/moveTo/:id',folderController.move);
// ==================================FOLDERS--API======================================

module.exports = route
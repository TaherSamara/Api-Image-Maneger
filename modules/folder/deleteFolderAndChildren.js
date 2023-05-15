const { Folderdb } = require("../../server/model");


// Define a recursive function to delete a folder and its children
const deleteFolderAndChildren = async (folderId) => {
  // Delete the folder with the given ID
  await Folderdb.deleteOne({ _id: folderId });

  // Find all the children folders of the deleted folder
  const childFolders = await Folderdb.find({ parent_id: folderId });

  // Recursively delete each child folder and its children
  for (let i = 0; i < childFolders.length; i++) {
    const childFolderId = childFolders[i]._id;
    await deleteFolderAndChildren(childFolderId);
  }
};

module.exports = deleteFolderAndChildren;

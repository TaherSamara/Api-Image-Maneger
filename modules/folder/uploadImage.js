// Import the multer library
const multer = require("multer");
const { UniqueString } = require("unique-string-generator");

// Set up disk storage for uploaded images
const storage = multer.diskStorage({
  // Destination directory for uploaded images
  destination: "uploads",
  // Use the original filename for the uploaded image
  filename: function (req, file, cb) {
    const uniqueName = UniqueString() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Set up a filter to only allow certain file types for uploaded images
const fileFilter = function (req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG image files are allowed!"), false);
  }
};

// Create a multer instance with the image storage and filter configurations
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).array("formData");


module.exports = upload;


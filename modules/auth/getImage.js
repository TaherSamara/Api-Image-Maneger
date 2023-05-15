const getUrlImage = (imageName) => {
  const url = "http://localhost:3000/uploads/";
  return url + imageName;
};

module.exports = getUrlImage;
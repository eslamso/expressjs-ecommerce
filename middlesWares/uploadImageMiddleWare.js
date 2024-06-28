const multer = require("multer");

const AppError = require("../utils/appError");
const storage = multer.memoryStorage();
const multerOptions = () => {
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else cb(new AppError("only images is allowed", 400), false);
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload;
};
exports.uploadSingleImage = (fieldName) =>
  multerOptions().single(`${fieldName}`);
exports.uploadImages = (array) => multerOptions().fields(array);

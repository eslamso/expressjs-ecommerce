const express = require("express");
const userController = require("../controllers/userController");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidators");
const { protect, restrictTo } = require("../controllers/authController");
const {
  changeMyPasswordValidator,
} = require("../utils/validators/authValidators");

const router = express.Router();

router.get("/getMe", protect, userController.getMe, userController.getUser);
router.delete("/deleteMe", protect, userController.deleteMe);

router.put(
  "/changeMyPassword",
  protect,
  changeMyPasswordValidator,
  userController.updateMyPassword
);
router.put("/updateMe", protect, updateUserValidator, userController.updateMe);

router.put(
  "/changePassword/:id",
  protect,
  restrictTo("admin"),
  changeUserPasswordValidator,
  userController.changeUserPassword
);
router
  .route("/")
  .post(
    protect,
    restrictTo("admin"),
    userController.uploadImage,
    userController.resizeImage,
    createUserValidator,
    userController.createUser
  )
  .get(protect, restrictTo("admin", "manager"), userController.getAllUsers);
router
  .route("/:id")
  .get(
    //1 rules,
    protect,
    restrictTo("admin"),
    getUserValidator,
    userController.getUser
  )
  .patch(
    protect,
    restrictTo("admin"),
    userController.uploadImage,
    userController.resizeImage,
    updateUserValidator,
    userController.updateUser
  )
  .delete(protect, restrictTo("admin"), userController.deleteUser);
module.exports = router;

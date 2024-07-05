const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user must have a name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "user must have a email"],
      unique: [true, "user must have unique email"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "user must have a password"],
      minlength: [6, "password must have at least 8 characters"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    passwordResetCodeVerified: Boolean,
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "manager"],
    },
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        city: String,
        postalCode: String,
      },
    ],
    profileImg: String,
    phoneNumber: String,
    active: {
      type: Boolean,
      default: true,
    },
    expireAt: {
      type: Date,
      index: { expireAfterSeconds: 10 },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.model("User", userSchema);

module.exports = user;

const mongoose = require("mongoose");
const slugify = require("slugify");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a category must have a name"],
      unique: [true, "a category must have unique name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
categorySchema.pre("save", function () {
  this.slug = slugify(this.name);
});

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;

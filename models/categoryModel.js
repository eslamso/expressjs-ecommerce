const mongoose = require("mongoose");

const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a category must have a name"],
      unique: [true, "a category must have unique name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});
categorySchema.post("init", (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/uploads/categories/${doc.image}`;
  }
});
const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;

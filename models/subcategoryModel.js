const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "subcategory must have a name"],
      unique: [true, 'subcategory must have a unique name"'],
    },
    slug: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "subCategory must belong to category"],
    },
  },
  { timestamps: true }
);

subcategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

const subCategoryModel = mongoose.model("Subcategory", subcategorySchema);
module.exports = subCategoryModel;

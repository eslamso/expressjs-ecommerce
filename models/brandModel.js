const mongoose = require("mongoose");

const slugify = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a brand must have a name"],
      unique: [true, "a brand must have unique name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
brandSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});
brandSchema.post("init", (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/uploads/brands/${doc.image}`;
  }
});
brandSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    // Check if the 'name' field is being updated
    console.log("Brand name is being updated"); // Log the update
    update.slug = slugify(update.name); // Generate a new slug for the updated name
  }
  next();
});

const brandModel = mongoose.model("Brand", brandSchema);
module.exports = brandModel;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minLength: 1,
      maxLength: 160,
      text: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: function (value) {
          return value !== 0;
        },
        message: "Price must be greater than 0",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      secure_url: {
        type: String,
        default: "",
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/.+/.test(v); // URL validation if provided
          },
          message: "Please provide a valid image URL",
        },
      },
      public_id: {
        type: String,
        default: "",
      },
    },
  },
  {
    indexes: [{ category: 1 }, { price: 1 }, { createdAt: -1 }],
    timestamps: true,
  }
);

productSchema.index({ category: 1, price: 1 });

// Static methods for common queries
productSchema.statics.findByCategory = function (minPrice, maxPrice) {
  return this.find({
    price: { $gte: minPrice, $lte: maxPrice },
    isActive: true,
  });
};

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

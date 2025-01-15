import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },
    subCategories: [
      {
        name: String,
        budget: Number,
      },
    ],
    budget: Number,
  },
  { timestamps: true }
);

// Create a model using the schema
const Category = mongoose.model("Category", categorySchema);

// Export the model
export default Category;

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategoryId: String,
    description: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Transaction = mongoose.model("Transaction", transactionSchema);

// Export the model
export default Transaction;

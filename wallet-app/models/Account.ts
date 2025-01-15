import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["bank", "cash", "mobile_money", "other"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: String,
  },
  { timestamps: true }
);

// Create a model using the schema
const Account = mongoose.model("Account", accountSchema);

// Export the model
export default Account;

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

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Delete mongoose model if it exists
if (mongoose.models.Account) {
  delete mongoose.models.Account;
}

const Account = mongoose.model("Account", accountSchema);
export default Account;

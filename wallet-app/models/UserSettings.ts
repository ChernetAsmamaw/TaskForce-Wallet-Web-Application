import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    language: {
      type: String,
      default: "en",
    },
    budgetAlerts: [
      {
        category: String,
        limit: Number,
        period: {
          type: String,
          enum: ["daily", "weekly", "monthly", "yearly"],
        },
      },
    ],
  },
  { timestamps: true }
);

// Check if the model exists before compiling it
const UserSettings =
  mongoose.models.UserSettings ||
  mongoose.model("UserSettings", userSettingsSchema);

export default UserSettings;

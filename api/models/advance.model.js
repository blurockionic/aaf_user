import mongoose from "mongoose";

const advanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid",
    },
    advanceAmount: {
      type: Number,
    },
    extraBonus: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Advance = mongoose.model("Advance", advanceSchema);

export default Advance;

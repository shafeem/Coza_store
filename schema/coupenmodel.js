const mongoose = require("mongoose");
const couponschema = new mongoose.Schema(
  {
    useduser: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    code: {
      type: String,
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    amount: {
      type: Number,
    },
    maximumRedeemAmount: {
      type: Number,
      required: true,
    },
    minimumCartAmount: {
      type: Number,
      required: true,
    },
    expiryDate:{
        type:Date,
        required:true
    }
  },
  {
    timestamps: true,
  }
);

const Coupons = mongoose.model("Coupons", couponschema);
module.exports = Coupons;

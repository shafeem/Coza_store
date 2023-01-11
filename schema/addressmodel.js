const mongoose = require("mongoose");

const addressscema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  address: [
    {
      fullname: {
        type: String,
        required:true
      },
      phone: {
        type: Number,
        required:true
      },
      address: {
        type: String,
        required:true
      },
      street: {
        type: String,
        required:true
      },
      city: {
        type: String,
        required:true
      },
      state: {
        type: String,
        required:true
      },
      pincode: {
        type: Number,
        required:true
      },
    },
  ],
});

const Address = mongoose.model("Address", addressscema);

module.exports = Address;

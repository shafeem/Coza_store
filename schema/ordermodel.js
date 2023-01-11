
const mongoose = require("mongoose");

const orderschema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products:[{
    product:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    },
    quantity:{
        type: Number,
        default: 1
    },
    total: {
        type: Number,
        default:0
    },
}],
  totalprice: {
    type: Number,
    required: true,
  },
  address: {
    fullname: String,
    phone:Number,
    address: String,
    city: String,
    country: String,
    state:String,
    pincode: Number,
  },
  paymentmethod: {
    type: String,
    required: true,
  },
  paymentstatus: {
    type: String,
    required: true,
  },
  orderstatus: {
    type: String,
    required: true,
  },
  track:{
    type: String,
  },
  returnreason:{
    type:String,
  },
  usewallet:{
    type:Number,
  },
  coupondiscount:{
    type:Number,
  },

},{
  timestamps:true  
 });

const Order = mongoose.model("Order", orderschema);

module.exports = Order;
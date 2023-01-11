const mongoose = require("mongoose");

const bannerscema = new mongoose.Schema({
  main_heading: {
    type: String,
  },
  heading: {
    type: String,
  },
  url: {
    type: String,
  },
  image:{
    type:Array
  }
});

const Banner = mongoose.model("Banner", bannerscema);

module.exports = Banner;

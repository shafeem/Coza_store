const express = require("express");
const {pagenation}=require('../middleware/pagenation')
const productscema=require('../schema/productmodels')
const {
  ulogin,
  uhome,
  uproduct,
  usignup,
  usersignup,
  userlogin,
  sessionchecker,
  userlogout,
  userblog,
  usercart,
  userblogdetails,
  usercontact,
  productdetails,
  otpverifyer,
  cartview,
  removefromcart,
  countchanger,
  quickview,
  uabout,
  profile,
  address,
  postaddress,
  editaddress,
  posteditaddress,
  checkout,
  payment,
  order,
  orderview,
  deleteaddress,
  error,
  cancellorder,
  couponverify,
  orderreturn,
  paypalorder,
  paypalpayment,
  productsort,
  postorderview,
  blockchecker,
  resent,
  searchresult,
} = require("../constroller/usercontroller");

const router = express.Router();

router.get("/", uhome);
router.get("/product",pagenation(productscema),uproduct);
router.get("/productdetails/:id", productdetails);
router.get("/login", ulogin);
router.get("/signup", usignup);
router.get("/logout", userlogout);
router.get("/blog", userblog);
router.get("/about", uabout);
router.get("/blogdetails", userblogdetails);
router.get("/contact", usercontact);
router.get("/cartview", sessionchecker,blockchecker, usercart);
router.get("/profile", sessionchecker,blockchecker, profile);
router.get("/address", sessionchecker,blockchecker, address);
router.get("/editaddress", sessionchecker,blockchecker, editaddress);
router.get("/checkout", sessionchecker,blockchecker, checkout);
router.get("/order", sessionchecker,blockchecker, order);
router.get("/ordercancel", sessionchecker,blockchecker, cancellorder);
router.get("/orderdetails/:id", sessionchecker,blockchecker, orderview);
router.get('/otp',resent)

router.post('/product',productsort)
router.post("/quickview/:id", quickview);
router.post("/login", userlogin);
router.post("/signup", usersignup);
router.post("/otp", otpverifyer);
router.post("/cart/:id", sessionchecker,blockchecker, cartview);
router.post("/address", sessionchecker,blockchecker, postaddress);
router.post("/editaddress/:id", sessionchecker,blockchecker, posteditaddress);
router.post("/payment", sessionchecker,blockchecker, payment);
router.post("/orderdetails/:id", sessionchecker,blockchecker,postorderview)
router.post('/getresult',sessionchecker,blockchecker,searchresult)


router.delete("/removefromcart", sessionchecker,blockchecker, removefromcart);
router.delete("/deleteaddress", sessionchecker,blockchecker, deleteaddress);

router.patch("/cartview/", sessionchecker,blockchecker, countchanger);




















router.get("/error", error);

router.post("/verifycoupon", sessionchecker,blockchecker, couponverify);

router.post("/orderreturn", sessionchecker,blockchecker, orderreturn);

router.post("/paypalorder", sessionchecker,blockchecker, paypalorder);

router.post("/paypalpayment", sessionchecker,blockchecker,paypalpayment)

module.exports = router;

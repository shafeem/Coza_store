const express = require("express");

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
} = require("../constroller/usercontroller");

const router = express.Router();

router.get("/", uhome);

router.get("/product", uproduct);

router.post('/product',productsort)

router.post("/quickview/:id", quickview);

router.get("/productdetails/:id", productdetails);

router.get("/login", ulogin);

router.post("/login", userlogin);

router.get("/signup", usignup);

router.post("/signup", usersignup);

router.post("/otp", otpverifyer);

router.get("/logout", userlogout);

router.get("/blog", userblog);

router.get("/about", uabout);

router.get("/blogdetails", userblogdetails);

router.get("/cartview", sessionchecker, usercart);

router.get("/contact", usercontact);

router.post("/cart/:id", sessionchecker, cartview);

router.delete("/removefromcart", sessionchecker, removefromcart);

router.patch("/cartview/", sessionchecker, countchanger);

router.get("/profile", sessionchecker, profile);

router.get("/address", sessionchecker, address);

router.post("/address", sessionchecker, postaddress);

router.get("/editaddress", sessionchecker, editaddress);

router.post("/editaddress/:id", sessionchecker, posteditaddress);

router.delete("/deleteaddress", sessionchecker, deleteaddress);

router.get("/checkout", sessionchecker, checkout);

router.post("/payment", sessionchecker, payment);

router.get("/order", sessionchecker, order);

router.get("/ordercancel", cancellorder);

router.get("/orderdetails/:id", orderview);

router.get("/error", error);

router.post("/verifycoupon", couponverify);

router.post("/orderreturn", orderreturn);

router.post("/paypalorder", paypalorder);

router.post("/paypalpayment",paypalpayment)

module.exports = router;

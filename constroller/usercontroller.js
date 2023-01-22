const session = require("express-session");
const userscema = require("../schema/usermodels");
const categoryscema = require("../schema/categorymodels");
const productscema = require("../schema/productmodels");
const cartscema = require("../schema/cartmodel");
const bannerscema = require("../schema/bannermodel");
const addressscema = require("../schema/addressmodel");
const orderscema = require("../schema/ordermodel");
const couponscema = require("../schema/coupenmodel");
const reviewscema = require("../schema/reviewmodel");
const bcrypt = require("bcrypt");
const app = require("../routes");
const moment = require("moment");
const paypal = require("@paypal/checkout-server-sdk");
const { response } = require("../routes");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const { sendsms, verifysms } = require("../verification/otp");

const twilio_sid = process.env.SID;
const twilio_token = process.env.TOKEN;
const twilio_serviceId = process.env.SSID;
const client = require("twilio")(twilio_sid, twilio_token);

const envirolment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalCliend = new paypal.core.PayPalHttpClient(
  new envirolment(process.env.PAYPAL_CLIND_ID, process.env.PAYPAL_CLIND_SECRET)
);

sess = null;
let mobil;
const ulogin = (req, res) => {
  try {
    let udata = req.session.userdata;
    res.render("user/login", {
      errs: req.session.errs,
      udata: req.session.userdata,
    });
  } catch (error) {
    res.redirect("/error");
  }
};

const usignup = (req, res) => {
  try {
    res.render("user/signup", {
      errs: req.session.errs,
      udata: req.session.userdata,
    });
    console.log("in signup ");
  } catch (error) {
    res.redirect("/error");
  }
};
const blockchecker = (req, res, next) => {
  user = req.session.userdata;
  if (user.access) {
    next();
  } else {
    res.redirect("/login");
  }
};
const uhome = async (req, res) => {
  try {
    const session = req.session.loginchecker;
    let udata = req.session.userdata;
    cartdt = req.session.cartdt;
    let categry = await categoryscema.find({});
    let productdetailes = await productscema.find({});
    let count = req.session.cartcount;
    let banner = await bannerscema.find({});
    let productdts = await productscema.find({});

    console.log(req.session.cartdt);
    console.log("this is cart dt check this");

    console.log(categry);
    console.log("this is category details");
    console.log("countcarty", count);
    console.log(udata);
    res.render("user/home", {
      session,
      udata: req.session.userdata,
      categry,
      productdetailes,
      count,
      cartdt,
      banner,
      productdts,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};

const uproduct = async (req, res) => {
  try {
    let productdts;
    let item = req.query.sort;
    let allproduct = res.pagenation.results;
    console.log(req.query, ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
    let pagenation = res.pagenation;
    if (item) {
      productdts = await productscema.find({ category: { $eq: item } });
      console.log("asdfghjklsdfghjklsdfghjkl");
    } else {
      productdts = allproduct;
      console.log("this is productdtskkkkkkkkkkkkk");
    }

    res.render("user/product", {
      udata: req.session.userdata,
      session: req.session.loginchecker,
      productdts,
      pagenation,
      allproduct,
      item,
    });
    console.log("in product page");
  } catch (error) {
    res.redirect("/error");
    console.log(error);
  }
};
const productsort = (req, res) => {
  console.log(req.query, "//////////////////");
};
const uabout = (req, res) => {
  res.render("user/about", { session: req.session.loginchecker });
};

const usersignup = async (req, res) => {
  try {
    mobil = Number(req.body.phone);

    let user = await userscema.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      console.log("email already used");
      req.session.errs = "email already exist";
      res.redirect("/signup");
    } else {
      req.session.useralldata = req.body;
      console.log("sesssion data og user", req.session.useralldata);

      if (
        req.body.name &&
        req.body.email &&
        req.body.phone &&
        req.body.password &&
        req.body.confirmpassword
      ) {
        const phone = req.body.phone;
        sendsms(phone);
        res.redirect("/otp");
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const resent = (req, res) => {
  try {
    res.render("user/otp");
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const otpverifyer = async (req, res) => {
  try {
    console.log(req.body.otp, mobil);
    console.log(req.body);
    console.log("heeeelllo");
    const phone = req.session.useralldata.phone;
    const otp = req.body.otp;
    await verifysms(phone, otp).then(async (verification_check) => {
      if (verification_check.status == "approved") {
        let password = req.session.useralldata.password;
        console.log(req.session.useralldata);
        // const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, 10);
        req.session.loginchecker = true;

        const user = userscema.create({
          name: req.session.useralldata.name,
          email: req.session.useralldata.email,
          mobile: req.session.useralldata.phone,
          password: password,
        });
        res.redirect("/");
      } else {
        console.log("asdfsafss");
        res.redirect("/otp");
      }
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};

const userlogin = async (req, res) => {
  try {
    console.log(req.body, "llllllllllll");
    let userp = req.body.password;
    let usere = req.body.email;
    const user1 = await userscema.findOne({ email: usere });
    if (user1) {
      console.log("user name is correct ");
      bcrypt.compare(userp, user1.password, (err, data) => {
        if (data) {
          console.log("correct password");
          if (user1.access) {
            console.log("have full access");
            req.session.loginchecker = true;
            req.session.userdata = user1;
            res.redirect("/");
          } else {
            console.log("blocked");
            req.session.errs = "User Blocked by Admin";
            res.redirect("/login");
          }
        } else {
          console.log("password error");
          req.session.errs = "Password error";
          res.redirect("/login");
        }
      });
    } else {
      console.log("user not found");
      req.session.errs = "User not Found";
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/error");
    console.log(error);
  }
};
const sessionchecker = (req, res, next) => {
  if (req.session.loginchecker) {
    next();
  } else {
    res.redirect("/login");
  }
};
const userlogout = (req, res) => {
  try {
    console.log("session destroyed");
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const userblog = (req, res) => {
  try {
    res.render("user/blog", {
      udata: req.session.userdata,
      session: req.session.loginchecker,
    });
  } catch (error) {
    res.redirect("/error");
  }
};
const usercart = async (req, res) => {
  try {
    let cartdt = await cartscema
      .find({ owner: req.session.userdata._id })
      .populate("item.product");
    if (cartdt.length == 0) {
      console.log(cartdt, ";;;;;;;;;;;;this is cartdb");

      console.log("this is product id");
      res.render("user/cartview", {
        udata: req.session.userdata,
        cartdt,
        session: req.session.loginchecker,
      });
    } else {
      console.log(cartdt, ";;;;;;;;;;;;this is cartdb");
      cartdt = cartdt[0];

      console.log("this is product id");
      res.render("user/cartview", {
        udata: req.session.userdata,
        cartdt,

        session: req.session.loginchecker,
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const userblogdetails = (req, res) => {
  try {
    res.render("user/blogdetails", {
      udata: req.session.userdata,
      session: req.session.loginchecker,
    });
  } catch (error) {
    res.redirect("/error");
  }
};

const usercontact = (req, res) => {
  try {
    res.render("user/contact", {
      udata: req.session.userdata,
      session: req.session.loginchecker,
    });
  } catch (error) {
    res.redirect("/error");
  }
};
const quickview = (req, res) => {
  console.log(req.params.id);
};

const productdetails = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let details = await productscema.findOne({ _id: id });
    // console.log(details);

    review = await reviewscema.find({ product: req.params.id });
    console.log(review, "fffffffffffffffffffffffffff");

    console.log(details.images.length);
    console.log("this is details");
    productdts = await productscema.find({});
    res.render("user/productdetails", {
      udata: req.session.userdata,
      details,
      productdts,
      session: req.session.loginchecker,
      review,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const cartview = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log("this is request id and before session");
    console.log(req.session.userdata._id);
    console.log("this is user id");

    const user = await cartscema.findOne({ owner: req.session.userdata._id });

    const productsdetail = await productscema.find({ _id: req.params.id });

    console.log(user);

    let pricee = productsdetail.price;
    console.log(productsdetail);
    console.log("this is pricee");

    // console.log(productsdetail);
    console.log("this is product details");
    if (productsdetail[0].stock < 1) {
      res.json({ status: true });
    } else {
      if (!user) {
        console.log("user didnt have a cart");
        // checking if product have stock
        const usercart = await cartscema({
          owner: req.session.userdata._id,
          item: [
            {
              product: req.params.id,
              price: productsdetail[0].price,
              total: productsdetail[0].price,
            },
          ],
          carttotal: productsdetail[0].price,
        });
        usercart.save().then((response) => {
          console.log("data saved to database");
        });
        res.json({ status: false });
      } else {
        console.log("user have a cart");

        const existproduct = await cartscema.findOne({
          owner: req.session.userdata._id,
          "item.product": req.params.id,
        });
        // console.log(existproduct);
        console.log("looking for product");

        if (existproduct) {
          console.log("already existing product");

          const proquantity = await cartscema.aggregate([
            {
              $match: {
                owner: mongoose.Types.ObjectId(req.session.userdata._id),
              },
            },
            {
              $project: {
                item: {
                  $filter: {
                    input: "$item",
                    cond: {
                      $eq: [
                        "$$this.product",
                        mongoose.Types.ObjectId(req.params.id),
                      ],
                    },
                  },
                },
              },
            },
          ]);
          let quantity = proquantity[0].item[0].quantity;
          console.log(
            proquantity,
            quantity,
            "////////////////////////////////////////"
          );
          console.log(productsdetail[0].stock, ";;;;;;;;;;;;;");
          if (productsdetail[0].stock > quantity) {
            await cartscema
              .updateOne(
                {
                  owner: req.session.userdata._id,
                  "item.product": req.params.id,
                },
                {
                  $inc: {
                    // 'item.$.price': productsdetail[0].price,
                    "item.$.quantity": 1,
                    "item.$.total": productsdetail[0].price.toFixed(2),
                    carttotal: productsdetail[0].price.toFixed(2),
                  },
                }
              )
              .then((response) => {
                // console.log(response);
                res.json({ status: false });
                console.log("responce recived");
              })
              .catch((err) => {
                console.log(err);
                console.log("error recieved");
              });
          } else {
            console.log("lllllllllllllkkkkkkkk");
            res.json({ status: true });
          }
        } else {
          console.log("user new product adding to cart");

          await cartscema.updateOne(
            {
              owner: req.session.userdata._id,
            },
            {
              $push: {
                item: [
                  {
                    product: req.params.id,
                    price: productsdetail[0].price.toFixed(2),
                    total: productsdetail[0].price.toFixed(2),
                  },
                ],
              },
              $inc: {
                carttotal: productsdetail[0].price.toFixed(2),
              },
            }
          );
          console.log("product added successfully");
          res.json({ status: false });
        }
      }
    }
  } catch (error) {
    console.log(error);
    console.log("error catched here!!!!");
    res.redirect("/error");
  }
};
const removefromcart = async (req, res) => {
  try {
    // console.log(req.query);
    console.log("this is product id !!!!!");
    // console.log(req.session.userdata);
    console.log("this is userdata");
    let userdt = req.session.userdata;
    let product = await productscema.findOne({ _id: req.query.productid });
    // console.log(product);
    // console.log('this is product details');
    productid = req.query.productid;
    let cart = await cartscema.findOne({ owner: userdt._id });
    // console.log(cart);
    // console.log('this is cart details of user');
    let index = await cart.item.findIndex((el) => {
      return el.product == productid;
    });
    console.log("cartlength", cart.item.length);
    let count = cart.item.length;
    req.session.cartcount = count;
    console.log(count);
    console.log("this is count of carts");
    console.log(index);
    console.log(count);
    console.log("index finded");

    let price = await cart.item[index].total;
    console.log(price);
    console.log("this is price");

    let deletingproduct = await cartscema.findOneAndUpdate(
      { owner: userdt._id },
      {
        $pull: {
          item: { product: productid },
        },
        $inc: { carttotal: -price },
      }
    );
    deletingproduct.save();
    res.json({ status: "sucesss" });
    //({sta})
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const countchanger = async (req, res) => {
  try {
    console.log("this is cartcountchanger.................");
    console.log(req.query);

    const { cartid, productid, cartcount, pcount } = req.query;

    let product = await productscema.findOne({ _id: productid });
    console.log(product);

    if (cartcount == 1) {
      if (product.stock > pcount) {
        res.json({ status: true });
        price = product.price;
        let cart = await cartscema
          .findOneAndUpdate(
            { _id: cartid, "item.product": productid },
            {
              $inc: {
                "item.$.quantity": cartcount,
                "item.$.total": price.toFixed(2),
                carttotal: price.toFixed(2),
              },
            }
          )
          .then(() => {
            console.log("quantity changed well ");
          });
      } else {
        res.json({ status: false });
      }
    } else {
      res.json({ status: true });
      price = -product.price;
      let cart = await cartscema
        .findOneAndUpdate(
          { _id: cartid, "item.product": productid },
          {
            $inc: {
              "item.$.quantity": cartcount,
              "item.$.total": price.toFixed(2),
              carttotal: price.toFixed(2),
            },
          }
        )
        .then(() => {
          console.log("quantity changed well ");
        });
    }

    console.log("this is cart details after the updation");
  } catch (error) {
    console.log(error);
    // res.redirect("/error");
  }
};

const profile = async (req, res) => {
  try {
    console.log("in profile page");
    let udata = req.session.userdata;
    let address = await addressscema.findOne({ user: udata._id });

    if (address != null) {
      console.log(address);
      console.log("this is user al;; datas");
      let add = address.address;
      res.render("user/profile", {
        session: req.session.loginchecker,
        udata,
        add,
        address,
      });
    } else {
      res.render("user/profile", {
        session: req.session.loginchecker,
        udata,
        address,
      });
    }
  } catch (error) {
    res.redirect("/error");
  }
};

const address = (req, res) => {
  try {
    console.log("in address section");
    let udata = req.session.userdata;
    res.render("user/address", { session: req.session.loginchecker, udata });
  } catch (error) {
    res.redirect("/error");
  }
};

const postaddress = async (req, res) => {
  // console.log('this is post address');
  try {
    console.log(req.body);
    console.log(req.session.userdata._id);
    let finding = await addressscema.findOne({
      user: req.session.userdata._id,
    });

    if (finding) {
      console.log("user already have a address");
      await addressscema.findOneAndUpdate(
        { user: req.session.userdata._id },
        {
          $push: {
            address: [req.body],
          },
        }
      );
      res.redirect("/profile");
    } else {
      console.log("user didnt have an address");
      let addressdata = new addressscema({
        user: req.session.userdata._id,
        address: [req.body],
      });
      console.log(addressdata);
      await addressdata.save().then(() => {
        console.log("address adding");
        res.redirect("/profile");
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};

const editaddress = async (req, res) => {
  try {
    console.log("edited address");
    let udata = req.session.userdata;
    let address = await addressscema.findOne({ user: udata._id });
    res.render("user/editaddress", {
      session: req.session.loginchecker,
      udata,
      address,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const posteditaddress = async (req, res) => {
  try {
    console.log("this is post addresses");
    console.log(req.body);
    console.log(req.params.id);

    await addressscema.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          address: [req.body],
        },
        new: true,
      },
      { upsert: true }
    );
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const deleteaddress = async (req, res) => {
  try {
    console.log(req.query.address);
    let addressid = req.query.address;
    let id = req.session.userdata._id;
    await addressscema.updateOne(
      { user: id },
      {
        $pull: { address: { _id: addressid } },
      }
    );
    res.json("success");
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};

const checkout = async (req, res) => {
  try {
    console.log("in checkout page");
    let udata = req.session.userdata;
    let address = await addressscema.findOne({ user: udata._id });
    let cartdt = await cartscema
      .find({ owner: req.session.userdata._id })
      .populate("item.product");
    cartdt = cartdt[0];
    console.log(cartdt, ' "jjjjjjjjjjjjjjjjjjj');
    let pic = cartdt.item;
    let idPaypal = process.env.PAYPAL_CLIND_ID;
    console.log(idPaypal, "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");

    if (address != null) {
      let add = address.address;
      res.render("user/checkout", {
        session: req.session.loginchecker,
        address,
        udata,
        add,
        cartdt,
        pic,
        idPaypal,
      });
    } else {
      res.render("user/checkout", {
        session: req.session.loginchecker,
        udata,
        cartdt,
        address,
        pic,
        idPaypal,
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const payment = async (req, res) => {
  try {
    console.log(req.session.userdata);
    let cart = await cartscema
      .find({ owner: req.session.userdata._id })
      .populate("item.product");
    console.log(cart, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

    let cproduct = cart[0].item;
    // console.log(cproduct,'/////////////////////////////////////');
    let Outstock = [];
    for (let i = 0; i < cproduct.length; i++) {
      if (cproduct[i].product.stock < cproduct[i].quantity) {
        Outstock.push(cproduct[i].product.product_name);
      }
    }
    if (Outstock.length != 0) {
      console.log(Outstock);
      console.log("product out of stock");
      res.json({ Outstock: true, Outstock });
    } else {
      console.log(req.body);
      let user = req.session.userdata;

      const paymentmethod = req.body.payment;
      let couponamount = req.body.coupamount;

      let index = req.body.address;
      let addressdetails = await addressscema.findOne({ user: user._id });
      let deliveryaddress = await addressdetails.address[index];
      let cartdt = await cartscema
        .find({ owner: req.session.userdata._id })
        .populate("item.product");
      let cartproduct = cartdt[0];
      let afteramount = cartproduct.carttotal - couponamount;

      if (isNaN(afteramount)) afteramount = cartproduct.carttotal;
      console.log(afteramount);

      console.log(
        couponamount,
        cartproduct.carttotal,
        afteramount,
        ";;;;;;;;;;;;;;;;;;"
      );

      console.log(cartproduct.item, "llllllllllllllllllllllllllllllllll");
      if (paymentmethod === "cod") {
        let neworder = await orderscema({
          date: moment().format("L"),
          time: moment().format("LT"),
          user: user._id,
          products: cartproduct.item,
          // maybe an error occure look carefully
          totalprice: afteramount,
          address: deliveryaddress,
          paymentmethod: "Cash on delivery",
          paymentstatus: "Payment Pending",
          orderstatus: "Order Confirmed",
          track: "Order Confirmed",
          coupondiscount: couponamount,
        });
        neworder.save().then(async (result) => {
          req.session.orderid = result._id;
          console.log("result collected");
          let order = await orderscema.findOne({ _id: req.session.orderid });
          let productdetail = order.products;
          // product count decreasing
          productdetail.forEach(async (el) => {
            await productscema.findOneAndUpdate(
              { _id: el.product },
              { $inc: { stock: -el.quantity } }
            );
            // user cart removing
            console.log(order.user, "................................");
            await cartscema.findOneAndDelete({ owner: order.user });
          });
        });
        res.json({ cashondelivery: true });
      } else if (paymentmethod === "paypal") {
        console.log("in paypal pageeeeee");
        let paypalorder = await orderscema({
          date: moment().format("L"),
          time: moment().format("LT"),
          user: user._id,
          products: cartproduct.item,
          // maybe an error occure look carefully
          totalprice: afteramount,
          address: deliveryaddress,
          paymentmethod: "Paypal",
          paymentstatus: "Paypal Pending",
          orderstatus: "Order Confirmed",
          track: "Order Confirmed",
          coupondiscount: couponamount,
        });
        paypalorder.save().then(async (result) => {
          console.log(result);
          let orderdata = result;

          req.session.orderid = result._id;
          res.json({ paypal: true, orderdata, afteramount });
        });
      } else if (paymentmethod === "wallet") {
        console.log("this is wallet payment kkkkkkkkkkkkk");
        let udata = req.session.userdata;
        let userid = udata._id;
        let user = await userscema.findById(userid);
        if (user.wallet == 0) {
          res.json({ empty: true });
        } else {
          if (user.wallet > afteramount) {
            console.log(user.wallet, "this is user wallet");
            let walletorder = await orderscema({
              date: moment().format("L"),
              time: moment().format("LT"),
              user: user._id,
              products: cartproduct.item,
              // maybe an error occure look carefully
              totalprice: afteramount,
              address: deliveryaddress,
              paymentmethod: "Wallet",
              paymentstatus: "Payment Completed",
              orderstatus: "Order Confirmed",
              usewallet: afteramount,
              track: "Order Confirmed",
              coupondiscount: couponamount,
            });
            walletorder.save().then(async (result) => {
              console.log(result);
              let orderdata = result;
              req.session.orderid = result._id;

              let currentwallet = user.wallet - afteramount;
              let newuser = await userscema.findOneAndUpdate(
                { _id: userid },
                { wallet: currentwallet }
              );

              console.log(newuser, "////////////////.////////////");

              console.log("result collected");
              let order = await orderscema.findOne({
                _id: req.session.orderid,
              });
              let productdetail = order.products;
              // product count decreasing
              productdetail.forEach(async (el) => {
                await productscema.findOneAndUpdate(
                  { _id: el.product },
                  { $inc: { stock: -el.quantity } }
                );
                // user cart removing
                console.log(order.user, "................................");
                await cartscema.findOneAndDelete({ owner: order.user });
              });

              req.session.orderid = result._id;
              console.log("result collected");

              res.json({ wallet: true, orderdata, afteramount });
            });
          } else {
            console.log(
              user.wallet,
              "this is user wallet and wallet/paypal payment method"
            );
            let payamount = afteramount - user.wallet;
            afteramount = payamount;
            let walletandpaypal = await orderscema({
              date: moment().format("L"),
              time: moment().format("LT"),
              user: user._id,
              products: cartproduct.item,
              // maybe an error occure look carefully
              totalprice: afteramount,
              address: deliveryaddress,
              paymentmethod: "Wallet/Paypal",
              paymentstatus: "Payment Pending",
              orderstatus: "Order Confirmed",
              usewallet: user.wallet,
              track: "Order Confirmed",
              coupondiscount: couponamount,
            });
            walletandpaypal.save().then(async (result) => {
              console.log(result);
              let orderdata = result;
              req.session.orderid = result._id;
              console.log("result collected");

              let currentwallet = 0;
              let newuser = await userscema.findOneAndUpdate(
                { _id: userid },
                { wallet: currentwallet }
              );
              console.log(newuser, "fghjklfghjklfghjkl");

              console.log("result collected");

              res.json({
                paypal: true,
                orderdata,
                afteramount,
                amountout: true,
              });
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const order = async (req, res) => {
  try {
    console.log("in order page");
    let udata = req.session.userdata;
    // productdts = await productscema.find({});
    let orderdetails = await orderscema
      .find({ user: udata._id })
      .sort({ createdAt: -1 });
    console.log(orderdetails);
    res.render("user/order", {
      udata,
      session: req.session.loginchecker,
      orderdetails,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const orderview = async (req, res) => {
  try {
    console.log("in order view page llllllll");
    let udata = req.session.userdata;
    let order = await orderscema
      .findOne({ _id: req.params.id })
      .populate("products.product");
    let product = order.products;
    let address = order.address;
    res.render("user/orderview", {
      udata,
      session: req.session.loginchecker,
      product,
      address,
      order,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
};
const postorderview = async (req, res) => {
  try {
    console.log("this is postorderview page please checkk this");
    console.log(req.body);
    console.log(req.params.id, "kkkkkkkkkkk");

    let order = await orderscema
      .findOne({ _id: req.params.id })
      .populate("products.product");
    console.log("thsi is order", order);

    console.log(req.body.product);

    let product = await productscema.findOne({
      product_name: req.body.product,
    });

    console.log("this is product", product);

    let reviewdetails = reviewscema({
      product: product._id,
      user: req.session.userdata._id,
      review: req.body.review,
      name: req.body.name,
      rating: req.body.rating,
      email: req.body.email,
    });
    await reviewdetails.save();

    res.redirect("/order");
  } catch (error) {
    res.redirect("/error");
    console.log(error);
  }
};
const error = (req, res) => {
  console.log("in error page");
  res.render("user/error");
};
const cancellorder = async (req, res) => {
  try {
    console.log("in cancell order page");
    console.log(req.query.id);

    let cancel = await orderscema.findById(req.query.id);
    console.log(cancel, ".............../////");
    console.log(cancel.paymentstatus);

    if (cancel.paymentstatus == "Payment Completed") {
      await userscema.findByIdAndUpdate(cancel.user, {
        wallet: cancel.totalprice,
      });
    }

    await orderscema
      .findByIdAndUpdate(req.query.id, {
        orderstatus: "Cancelled",
        track: "Cancelled",
      })
      .then((result) => {
        const productid = result.products;
        productid.forEach(async (element) => {
          await productscema.findOneAndUpdate(
            { _id: productid.product },
            { $inc: { stock: element.quantity } }
          );
        });
      });
  } catch (error) {
    console.log(error);
    res.render("user/error");
  }
};
const couponverify = async (req, res) => {
  try {
    console.log("this is couponverify");
    // console.log(req.body);
    const { ctotal, coupencode } = req.body;
    console.log(ctotal, coupencode);
    console.log(coupencode);

    const coupon = await couponscema.find({
      code: coupencode,
      status: "active",
    });
    console.log(coupon[0].useduser[0], "111111111111112222222222222");
    console.log(coupon.used, "111111111111112222222222222");
    console.log(coupon, "111111111111112222222222222");

    if (coupon.length == 0) {
      msg = "Coupon Invalid";
      res.json({ status: false, msg });
    } else {
      console.log(coupon[0].useduser, ";;;;;;;;;;;;;;;");
      if (coupon[0].useduser.length == 0) {
        console.log("no one used this coupon");
        let todaydate = new Date().toLocaleDateString();
        let maximumRedeemAmount = coupon[0].maximumRedeemAmount;
        console.log(maximumRedeemAmount, "this is maximum redeem amount");
        let minimumCartAmount = coupon[0].minimumCartAmount;
        console.log(minimumCartAmount, "sdfghjkl");
        let amount = coupon[0].amount;
        let available = coupon[0].available;

        let expirydate = coupon[0].expiryDate.toLocaleDateString();
        console.log(expirydate, "this is expiry date");
        console.log(todaydate, "this is today date");

        if (available > 0) {
          console.log("coupon have count");
          console.log(available);
          if (todaydate <= expirydate) {
            console.log("expiry greater than today date");
            if (ctotal < minimumCartAmount) {
              console.log("22222222");
              msg =
                "Minimum Rs." +
                minimumCartAmount +
                " need to Apply this Coupon";
              res.json({ status: false, msg });
            } else {
              grandtotal = ctotal - amount;
              req.session.grandtotal = grandtotal;
              res.json({ status: true, grandtotal, amount });
            }
          } else {
            console.log("coupon expired");
            msg = "This Coupon Is Expired";
            res.json({ status: false, msg });
          }
        }
        let newone= await couponscema.findOneAndUpdate({
          code: coupencode,
          status: "active",
        },
        {
          useduser: [
            {
              owner: req.session.userdata._id,
            }, 
          ],
        });
        console.log(newone,'this is the new coupon');
      }else{
        console.log('else if working kkkkk');
        console.log(coupon[0].useduser[0].owner,"sesssion data og user", req.session.userdata._id);
        if(coupon[0].useduser[0].owner==req.session.userdata._id){
          console.log('this is used coupon');
          res.json({ used: true });
        }else{
          console.log("one user not used this coupon check this");
          let todaydate = new Date().toLocaleDateString();
          let maximumRedeemAmount = coupon[0].maximumRedeemAmount;
          console.log(maximumRedeemAmount, "this is maximum redeem amount");
          let minimumCartAmount = coupon[0].minimumCartAmount;
          console.log(minimumCartAmount, "sdfghjkl");
          let amount = coupon[0].amount;
          let available = coupon[0].available;
  
          let expirydate = coupon[0].expiryDate.toLocaleDateString();
          console.log(expirydate, "this is expiry date");
          console.log(todaydate, "this is today date");
  
          if (available > 0) {
            console.log("coupon have count");
            console.log(available);
            if (todaydate <= expirydate) {
              console.log("expiry greater than today date");
              if (ctotal < minimumCartAmount) {
                console.log("22222222");
                msg =
                  "Minimum Rs." +
                  minimumCartAmount +
                  " need to Apply this Coupon";
                res.json({ status: false, msg });
              } else {
                grandtotal = ctotal - amount;
                req.session.grandtotal = grandtotal;
                res.json({ status: true, grandtotal, amount });
              }
            } else {
              console.log("coupon expired");
              msg = "This Coupon Is Expired";
              res.json({ status: false, msg });
            }
          }
          let newone= await couponscema.findOneAndUpdate({
            code: coupencode,
            status: "active",
          },
          {
            useduser: [
              {
                owner: req.session.userdata._id,
              }, 
            ],
          });
          console.log(newone,'this is the new coupon');
        }
      }
    }
    console.log("coupon comleated");
  } catch (error) {
    res.redirect("/error");
    console.log(error);
  }
};
const orderreturn = async (req, res) => {
  console.log("order return page");
  console.log(req.body);

  let order = await orderscema.findByIdAndUpdate(req.body.id, {
    orderstatus: "Returned",
    track: "Returned",
  });
  console.log(order, ",.,.,.,.,.,.,.,.,.,.,");
  let productdetail = order.products;
  // // product count decreasing
  let productnew;
  productdetail.forEach(async (el) => {
    productnew= await productscema.findOneAndUpdate(
      { _id: el.product },
      { $inc: { stock: -el.quantity } }
    )});
    console.log('this is product after',productnew);
};
const paypalorder = async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();

  console.log("////////");
  console.log("kjjkkj");
  console.log(req.body);
  console.log(req.body.items[0].amount);
  const balance = req.body.items[0].amount;

  console.log("jj");
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: balance,

          breakdown: {
            item_total: {
              currency_code: "USD",
              value: balance,
            },
          },
        },
      },
    ],
  });
  try {
    console.log(",,,,,,,");
    const order = await paypalCliend.execute(request);
    console.log(".........");
    console.log(order);
    console.log(order.result.id);
    res.json({ id: order.result.id });
  } catch (e) {
    console.log("....,.,mmm");
    console.log(e);
    res.status(500).json(e);
  }
};
const paypalpayment = async (req, res) => {
  try {
    console.log("in paypalpayment page");
    console.log(req.body);

    let order = await orderscema.findOne({ _id: req.session.orderid });
    let productdetail = order.products;
    productdetail.forEach(async (el) => {
      await productscema.findOneAndUpdate(
        { _id: el.product },
        { $inc: { stock: -el.quantity } }
      );
      // user cart removing
      console.log(order.user, "................................");
      await cartscema.findOneAndDelete({ owner: order.user });
    });

    await orderscema.findByIdAndUpdate(req.session.orderid, {
      orderstatus: "Order Confirmed",
      paymentstatus: "Payment Completed",
    });

    res.json({ status: true });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
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
};

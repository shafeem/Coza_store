const adminscema = require("../schema/adminmodels");
const catogaryscema = require("../schema/categorymodels");
const userscema = require("../schema/usermodels");
const productscema = require("../schema/productmodels");
const bannerscema = require("../schema/bannermodel");
const orderscema = require("../schema/ordermodel");
const couponscema = require("../schema/coupenmodel");

const app = require("../routes");
const session = require("express-session");
const bcrypt = require("bcrypt");
const moment = require("moment");
// const { findByIdAndUpdate } = require('../schema/adminmodels')

const admindashbord = (req, res) => {
  try {
    res.render("admin/dashbord", {
      amsg: req.session.amsg,
      adatas: req.session.admindata,
    });
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const adminlogin = (req, res) => {
  res.render("admin/login", { amsg: req.session.amsg });
};
const adminlogger = (req, res) => {
  try {
    console.log(req.body);
    const ade = req.body.email;
    const adp = req.body.password;
    let adatas;
    let amsg;
    req.session.admindata = req.body;

    if (ade == process.env.ADMIN_EMAIL) {
      console.log("email correct");
      if (adp == process.env.ADMIN_PASSWORD) {
        req.session.aloginchecker = true;
        res.redirect("/admin/adashbord");
      } else {
        req.session.amsg = "Password Error";
        res.redirect("/admin");
      }
    } else {
      req.session.amsg = "Email Error";
      console.log(req.session.amsg);
      res.redirect("/admin");
    }
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const adminlogout = (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const adminsession = (req, res, next) => {
  try {
    if (req.session.aloginchecker) {
      next();
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const allusers = async (req, res) => {
  try {
    let getuser = await userscema.find();
    req.session.alluserdetails = getuser;
    console.log(getuser.accees);
    console.log("admin access");
    res.render("admin/allusers", { getuser });
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const userblock = async (req, res) => {
  try {
    console.log(req.params.id);
    let datas = await userscema.findByIdAndUpdate(req.params.id, {
      access: false,
    });
    console.log(datas);
    console.log("admin blocking");
    res.redirect("/admin/allusers");
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const userunblock = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log("admin unblocking");
    datas = await userscema.findByIdAndUpdate(req.params.id, { access: true });
    res.redirect("/admin/allusers");
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const category = async (req, res) => {
  try {
    let categoryds = await catogaryscema.find();
    res.render("admin/category", { categoryds });
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const addcategory = (req, res) => {
  try {
    if (req.session.message) {
      let message = "Category Already Used! Please Choose Another One";
      res.render("admin/addcategory", { message });
    } else {
      message = null;
      res.render("admin/addcategory", { message });
    }
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const postcategory = async (req, res) => {
  try {
    let { category, message } = req.body;
    console.log(category);
    console.log(
      "this is category ................................................"
    );

    category = category.toUpperCase();
    console.log(category);
    console.log(
      "this is category///////////////////////////////////////////////////////////////"
    );
    let categorydetails = { category, message };
    let imageurll = req.files;
    req.session.message = false;
    let finding = await catogaryscema.findOne({ category: category });
    console.log("finding");
    if (finding) {
      req.session.message = true;
      res.redirect("/admin/addcategory");
    } else {
      Object.assign(categorydetails, { imageurl: imageurll });
      const cdetails = await new catogaryscema(categorydetails);
      cdetails.save().then((result) => {
        console.log(result);
        res.redirect("/admin/category");
      });
    }
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const deletecategory = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log("in category deleting");
    datas = await catogaryscema.deleteOne({ _id: req.params.id });
    res.redirect("/admin/category");
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const editcategory = async (req, res) => {
  try {
    let d = req.params.id;
    datas = await catogaryscema.findById({ _id: req.params.id });
    console.log(datas);

    if (req.session.message) {
      let message = "Category Name Already Used!!.Try Another One";
      res.render("admin/editcategory", { datas, message });
    } else {
      message = null;
      res.render("admin/editcategory", { datas, message });
    }
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const postecategory = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);
    console.log(req.params.id);

    if (req.body && req.params.id) {
      console.log("in first if condition");

      let category = req.body.category;
      category = category.toUpperCase();
      let message = req.body.message;
      req.body = { category, message };

      req.session.message = false;

      let categ = await catogaryscema.findOne({ category: category });

      console.log(
        "this is categ.........................................................................."
      );
      if (categ) {
        req.session.message = true;
        res.redirect("/admin/editcategory/" + req.params.id);
      } else {
        if (req.files.length == 0) {
          console.log("in second if statement");
          await Object.assign(req.body, {
            timestamps: moment().format("DD-MM-YYYY"),
          });
          datas = await catogaryscema.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {
              upsert: true,
              new: true,
              runValidators: true,
            }
          );
          res.redirect("/admin/category");
          console.log(datas);
        } else {
          console.log("hello welcome");
          imageurll = req.files;
          data = req.body;
          await Object.assign(req.body, { imageurl: imageurll });
          console.log("before await");
          datas = await catogaryscema.findByIdAndUpdate(
            req.params.id,
            { $set: data },
            {
              upsert: true,
              new: true,
              runValidators: true,
            }
          );
          res.redirect("/admin/category");
        }
      }
    } else {
      res.redirect("/admin/category");
    }
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const product = async (req, res) => {
  try {
    let productds = await productscema.find({});
    res.render("admin/product", { productds });
  } catch (error) {
    res.redirect("/admin/error");
  }
};
const addproduct = async (req, res) => {
  try {
    let cat = await catogaryscema.find({});
    res.render("admin/addproduct", { cat });
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const postaddproduct = async (req, res) => {
  try {
    console.log(req.body);
    console.log("this is body");
    console.log(req.files);
    console.log("this is files");
    let imgss = req.files;
    Object.assign(req.body, { images: imgss });
    await productscema.create(req.body);
    console.log(req.body);
    console.log("after req.body");
    // img=[]
    // req.files.forEach((element) => {
    //     img.push(element.filename)
    // });
    res.redirect("/admin/product");
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const deleteproduct = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log("this is params");
    await productscema.deleteOne({ _id: req.params.id });
    res.redirect("/admin/product");
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const editproduct = async (req, res) => {
  try {
    console.log("this is editproduct");
    console.log(req.params.id);
    console.log("this is params");
    datas = await productscema.findByIdAndUpdate(req.params.id);
    console.log(datas);
    console.log("this is product datas");

    let catdet = await catogaryscema.find();
    req.session.category = catdet;

    res.render("admin/editproduct", { datas, catdet });
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const posteditproduct = async (req, res) => {
  try {
    console.log("faheem");
    console.log(req.body);
    console.log(req.files);
    console.log("this is req.files");
    console.log(req.params.id);
    console.log("this is params id");

    if (req.files && req.body) {
      console.log('lolo');
      if (req.files == 0) {
        console.log('koko');
        Object.assign(req.body, { timestamps: moment().format("DD-MM-YYYY") });
        console.log('popo');
        await productscema.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          {
            upsert: true,
            new: true,
            runValidators: true,
          },
          // {
          //   updatedAt: moment().format("DD-MM-YYYY"),
          // }
        );
        console.log("first if statement worked");
        res.redirect("/admin/product");
      } else {
        datas = req.files;
        Object.assign(
          req.body,
          { images: datas },
          { timestamps: moment().format("DD-MM-YYYY") }
        );
        await productscema.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          {
            upsert: true,
            new: true,
            runValidators: true,
          }
        );
        console.log("first if else statement worked");
        console.log(datas);
        res.redirect("/admin/product");
      }
    } else {
      console.log("if not worked in this case");
      res.redirect("/admin/product");
    }
  } catch (error) {
    res.redirect("/admin/error");
    console.log(error);
  }
};

const banner = async (req, res) => {
  try {
    let banner = await bannerscema.find({});
    //   console.log(banner);
    res.render("admin/banner", { banner });
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const addbanner = async (req, res) => {
  res.render("admin/addbanner");
};
const postbanner = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

    Object.assign(req.body, { image: req.files });
    await bannerscema.create(req.body);

    res.redirect("/admin/banner");
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const editbanner = async (req, res) => {
  try {
    console.log(req.params.id);
    let bannerdetails = await bannerscema.findOne({ _id: req.params.id });
    res.render("admin/editbanner", { bannerdetails });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/error");
  }
};

const posteditbanner = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);
    console.log(req.params.id);
    if (req.body && req.files) {
      if (req.files == 0) {
        console.log("inside condition");
        await bannerscema.findOneAndUpdate(
          req.params.id,
          { $set: req.body },
          {
            upsert: true,
            new: true,
            runValidators: true,
          }
        );
        res.redirect("/admin/banner");
      } else {
        Object.assign(req.body, { image: req.files });

        await bannerscema.findOneAndUpdate(
          req.params.id,
          { $set: req.body },
          {
            upsert: true,
            new: true,
            runValidators: true,
          }
        );
        res.redirect("/admin/banner");
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect("/admin/error");
  }
};

const deletebanner = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log("this is req.params.id");

    await bannerscema.deleteOne({ _id: req.params.id });
    console.log("bannerdeleting compleated");

    res.redirect("/admin/banner");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/error");
  }
};
const orders = async (req, res) => {
  try {
    let orderdetails = await orderscema.find({}).sort({createdAt:-1});
    console.log(orderdetails);
    res.render("admin/orders", { orderdetails });
  } catch (error) {
    res.redirect("/admin/error");
  }
};
const orderview = async (req, res) => {
  try {
    console.log(req.params.id);
    let order = await orderscema
      .findOne({ _id: req.params.id })
      .populate("products.product");
    let product = order.products;
    let address = order.address;
    res.render("admin/orderview", { product, address, order });
  } catch (error) {
    res.redirect("/admin/error");
  }
};

const orderstatus = async (req, res) => {
  try {
    console.log(req.body);
    let id = req.body.id;
    let value = req.body.value;
    if (value == "Delivered") {
      await orderscema
        .updateOne(
          { _id: id },
          {
            $set: {
              track: value,
              orderstatus: value,
              paymentstatus: "Payment Completed",
            },
          }
        )
        .then((responce) => {
          res.json({ status: true });
        });
    } else {
      await orderscema
        .updateOne(
          { _id: id },
          {
            $set: {
              track: value,
              orderstatus: value,
            },
          }
        )
        .then((responce) => {
          res.json({ status: true });
        });
    }
  } catch (error) {
    res.redirect("/admin/error");
  }
};
const error = (req, res) => {
  console.log("in error page");
  res.render("admin/error");
};
const coupon =async (req, res) => {
  let coupon=await couponscema.find({})
  res.render("admin/coupon",{coupon});
};
const addcoupon = (req, res) => {
  try {
    res.render("admin/addcoupon");
  } catch (error) {
    res.redirect("/admin/error");
  }
};
const postcoupon =async (req, res) => {
  try {
    console.log("in post coupon page");
    console.log(req.body);

    await couponscema.create(req.body)
    res.redirect('/admin/coupon')

  } catch (error) {
    console.log(error);
    res.redirect("/admin/error");
  }
};
const coupondelete=async(req,res)=>{
  try {
  //   console.log(req.body.id);
  // await couponscema.findByIdAndDelete({_id:req.body.id})
  res.redirect('/admin/coupon')
  } catch (error) {
    console.log(error);
    res.redirect('/admin/error')
  }
}
const orderapproval=async (req,res)=>{
  console.log(req.body,'lllllllllllllllllllll');

  await orderscema.findByIdAndUpdate(req.body.id,
    {orderstatus:'Returned Success',
    track:'Returned Success'})
  
  await userscema.findByIdAndUpdate(req.body.user,
    {
      $inc:{
        wallet:req.body.price
      }
    })  

  res.json({status:true})
}

module.exports = {
  admindashbord,
  adminlogin,
  adminlogger,
  adminlogout,
  adminsession,
  allusers,
  userblock,
  userunblock,
  category,
  addcategory,
  postcategory,
  deletecategory,
  editcategory,
  postecategory,
  product,
  addproduct,
  postaddproduct,
  deleteproduct,
  editproduct,
  posteditproduct,
  banner,
  addbanner,
  postbanner,
  editbanner,
  posteditbanner,
  deletebanner,
  orders,
  orderview,
  orderstatus,
  error,
  coupon,
  addcoupon,
  postcoupon,
  coupondelete,
  orderapproval,
  
};

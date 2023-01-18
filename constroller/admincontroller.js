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

const admindashbord = async (req, res) => {
  try {

    let order = await orderscema.find().count()
    let price = await orderscema.aggregate([
      { $match: { orderstatus: "Delivered" } },
     {$group:{_id:order._id,
    total:{$sum:"$totalprice"}}},{
      $project:{_id:0}
    }
    ]);
    let sales= await orderscema.aggregate([
      { $match: { orderstatus: "Delivered" } }])
    console.log(sales, "this is the orderfffffffffff");
    let user = await userscema.find({});

    let preturn=await orderscema.aggregate([
      {$match:{orderstatus:'Returned Success'}}
    ])

    console.log(preturn, "this is;;;;;;erfffffffffff");

    res.render("admin/dashbord", {
      // order,
      amsg: req.session.amsg,
      adatas: req.session.admindata,
      user,
      price,
      sales,
      preturn,
    });
  } catch (error) {
    console.log(error);
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
    let { category, message, offer } = req.body;
    console.log(category);
    console.log(
      req.body,
      "this is category, ................................................"
    );

    category = category.toUpperCase();
    console.log(category);
    console.log(
      "this is category///////////////////////////////////////////////////////////////"
    );
    let categorydetails = { category, message, offer };
    let imageurll = req.files;
    req.session.message = false;
    let finding = console.log("finding");
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
      let offer = req.body.offer;
      req.body = { category, message, offer };

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
    console.log(req.files);
    console.log("this is files");
    let imgss = req.files;

    let product = req.body;
    console.log(product.category);
    let categorydt = await catogaryscema.findOne({
      $and: [
        { category: { $eq: product.category } },
        { offer: { $exists: true } },
      ],
    });
    console.log(
      categorydt,
      "kkkkkkkk``~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~kkkkkk"
    );

    // checking if category have a offer
    let price = product.price;
    let savingproduct;
    console.log("this is product price", price);
    let categoryoffer;
    categoryoffer = categorydt.offer;
    let categoryofferprice;
    let productoffer = product.offer;
    console.log("this is category offer", categoryoffer);
    console.log("this is product offer", productoffer);
    let productofferprice;
    let currentprice;

    if (categoryoffer != null && productoffer == null) {
      // if category and product also have offers
      console.log("this is category offer", categoryoffer);

      categoryofferprice = (price * categoryoffer) / 100;
      console.log("thils is categoryofferprice", categoryofferprice);
      console.log("this is category condition");

      currentprice = req.body.price - categoryofferprice;
      savingproduct = {
        product_name: req.body.product_name,
        category: req.body.category,
        brand: req.body.brand,
        price: currentprice,
        stock: req.body.stock,
        discription: req.body.discription,
        actualprice: req.body.price,
        offer: req.body.offer,
      };
      console.log(currentprice, "1111111111111111111111111111111");
    } else if (productoffer != null && categoryoffer == null) {
      console.log("this is product condition");
      console.log("this is product offer", productoffer);
      productofferprice = (price * productoffer) / 100;
      console.log("this is productofferprice ", productofferprice);

      productofferprice = (price * productoffer) / 100;
      currentprice = req.body.price - productofferprice;
      savingproduct = {
        product_name: req.body.product_name,
        category: req.body.category,
        brand: req.body.brand,
        price: currentprice,
        stock: req.body.stock,
        discription: req.body.discription,
        actualprice: req.body.price,
        offer: req.body.offer,
      };
      console.log(currentprice, "2222222222222222222222222222222222");
    } else if (productofferprice < categoryofferprice) {
      categoryofferprice = (price * categoryoffer) / 100;

      currentprice = req.body.price - categoryofferprice;
      savingproduct = {
        product_name: req.body.product_name,
        category: req.body.category,
        brand: req.body.brand,
        price: currentprice,
        stock: req.body.stock,
        discription: req.body.discription,
        actualprice: req.body.price,
        offer: req.body.offer,
      };
      console.log(currentprice, "333333333333333333333333333333333");
    } else {
      productofferprice = (price * productoffer) / 100;

      currentprice = req.body.price - productofferprice;
      console.log(req.body.price, "llllllllllllllllllllllllllll");
      console.log(productofferprice, "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
      savingproduct = {
        product_name: req.body.product_name,
        category: req.body.category,
        brand: req.body.brand,
        price: currentprice,
        stock: req.body.stock,
        discription: req.body.discription,
        actualprice: req.body.price,
        offer: req.body.offer,
      };
      console.log(
        currentprice,
        "asdfghjklasdfghjklasdfghjkllllll1111111111111"
      );
    }

    Object.assign(savingproduct, { images: imgss });
    await productscema.create(savingproduct);
    console.log(savingproduct);
    console.log("44444444444444444444444444444444444444444444");
    // img = [];
    // req.files.forEach((element) => {
    //   img.push(element.filename);
    // });

    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);
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
      console.log("lolo");
      if (req.files == 0) {
        let imgss = req.files;

        let product = req.body;
        console.log(product.category);
        let categorydt = await catogaryscema.findOne({
          $and: [
            { category: { $eq: product.category } },
            { offer: { $exists: true } },
          ],
        });
        console.log(
          categorydt,
          "kkkkkkkk``~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~kkkkkk"
        );

        // checking if category have a offer
        let price = product.price;
        let savingproduct;
        console.log("this is product price", price);
        let categoryoffer;
        categoryoffer = categorydt.offer;
        let categoryofferprice;
        let productoffer = product.offer;
        console.log("this is category offer", categoryoffer);
        console.log("this is product offer", productoffer);
        let productofferprice;
        let currentprice;

        if (categoryoffer != null && productoffer == null) {
          // if category and product also have offers
          console.log("this is category offer", categoryoffer);

          categoryofferprice = (price * categoryoffer) / 100;
          console.log("thils is categoryofferprice", categoryofferprice);
          console.log("this is category condition");

          currentprice = req.body.price - categoryofferprice;
          savingproduct = {
            product_name: req.body.product_name,
            category: req.body.category,
            brand: req.body.brand,
            price: currentprice,
            stock: req.body.stock,
            discription: req.body.discription,
            actualprice: req.body.price,
            offer: req.body.offer,
          };
          console.log(currentprice, "1111111111111111111111111111111");
        } else if (productoffer != null && categoryoffer == null) {
          console.log("this is product condition");
          console.log("this is product offer", productoffer);
          productofferprice = (price * productoffer) / 100;
          console.log("this is productofferprice ", productofferprice);

          productofferprice = (price * productoffer) / 100;
          currentprice = req.body.price - productofferprice;
          savingproduct = {
            product_name: req.body.product_name,
            category: req.body.category,
            brand: req.body.brand,
            price: currentprice,
            stock: req.body.stock,
            discription: req.body.discription,
            actualprice: req.body.price,
            offer: req.body.offer,
          };
          console.log(currentprice, "2222222222222222222222222222222222");
        } else if (productofferprice < categoryofferprice) {
          categoryofferprice = (price * categoryoffer) / 100;

          currentprice = req.body.price - categoryofferprice;
          savingproduct = {
            product_name: req.body.product_name,
            category: req.body.category,
            brand: req.body.brand,
            price: currentprice,
            stock: req.body.stock,
            discription: req.body.discription,
            actualprice: req.body.price,
            offer: req.body.offer,
          };
          console.log(currentprice, "333333333333333333333333333333333");
        } else {
          productofferprice = (price * productoffer) / 100;

          currentprice = req.body.price - productofferprice;
          console.log(req.body.price, "llllllllllllllllllllllllllll");
          console.log(productofferprice, "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
          savingproduct = {
            product_name: req.body.product_name,
            category: req.body.category,
            brand: req.body.brand,
            price: currentprice,
            stock: req.body.stock,
            discription: req.body.discription,
            actualprice: req.body.price,
            offer: req.body.offer,
          };
          console.log(
            currentprice,
            "asdfghjklasdfghjklasdfghjkllllll1111111111111"
          );
        }

        // Object.assign(savingproduct, { images: imgss });
        // await productscema.create(savingproduct);
        // console.log(savingproduct);
        // console.log("44444444444444444444444444444444444444444444");
        // img = [];
        // req.files.forEach((element) => {
        //   img.push(element.filename);
        // });

        console.log("koko");
        Object.assign(savingproduct, {
          timestamps: moment().format("DD-MM-YYYY"),
        });
        console.log("popo");
        await productscema.findByIdAndUpdate(
          req.params.id,
          { $set: savingproduct },
          {
            upsert: true,
            new: true,
            runValidators: true,
          }
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
          { $set: savingproduct },
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
    let orderdetails = await orderscema.find({}).sort({ createdAt: -1 });
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
const coupon = async (req, res) => {
  let coupon = await couponscema.find({});
  res.render("admin/coupon", { coupon });
};
const addcoupon = (req, res) => {
  try {
    res.render("admin/addcoupon");
  } catch (error) {
    res.redirect("/admin/error");
  }
};
const postcoupon = async (req, res) => {
  try {
    console.log("in post coupon page");
    console.log(req.body);

    await couponscema.create(req.body);
    res.redirect("/admin/coupon");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/error");
  }
};
const coupondelete = async (req, res) => {
  try {
    //   console.log(req.body.id);
    // await couponscema.findByIdAndDelete({_id:req.body.id})
    res.redirect("/admin/coupon");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/error");
  }
};
const orderapproval = async (req, res) => {
  console.log(req.body, "lllllllllllllllllllll");

  await orderscema.findByIdAndUpdate(req.body.id, {
    orderstatus: "Returned Success",
    track: "Returned Success",
  });

  await userscema.findByIdAndUpdate(req.body.user, {
    $inc: {
      wallet: req.body.price,
    },
  });

  res.json({ status: true });
};
const salesreport=async(req,res)=>{
  console.log('this is sales report page');
  let order=await orderscema.find({})
  console.log(order);
  const salesreport = await orderscema.aggregate([
    {
      $match: { orderstatus: { $eq: "Delivered" } },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalprice: { $sum: "$totalprice" },
        products: { $sum: { $size: "$products.quantity" } },
        count: { $sum: 1 },
      },
     
    },
    { $sort: { date: -1 } },
  ]);
  console.log(salesreport);
  res.render('admin/salesreport',{
    order,
    salesreport,
  })
}
const monthlyreport=async (req,res)=>{
  try{
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const salesreport = await orderscema.aggregate([
      {
        $match: { orderstatus: { $eq: "Delivered" } },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalprice: { $sum: "$totalprice" },
          products: { $sum: { $size: "$products" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { date: -1 } },
    ]);
    const newsalesreport = salesreport.map((el) => {
      let newEl = { ...el };
      newEl._id.month = months[newEl._id.month - 1];
      return newEl;
    });
    res.render("admin/monthlyreport", { salesreport: newsalesreport });
  } catch (error) {
    res.render("admin/error");
    console.log(error);
  }
}
const yearlyreport = async (req, res) => {
  try {
    const salesreport = await orderscema.aggregate([
      {
        $match: { orderstatus: { $eq: "Delivered" } },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          totalprice: { $sum: "$totalprice" },
          products: { $sum: { $size: "$products" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    // const filterOrder = await Order.find({})
    res.render("admin/yearlyreport", { salesreport });
  } catch (error) {
    console.log(error);
    res.render("admin/error");
  }
};


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
  salesreport,
  monthlyreport,
  yearlyreport
};

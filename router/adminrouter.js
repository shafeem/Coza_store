const express=require('express')
const imagemulter=require('../muler/multer')
const {
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

}=require('../constroller/admincontroller')



const router=express.Router()

router.get('/adashbord',adminsession,admindashbord)

router.get('/',adminlogin)

router.post('/',adminlogger)

router.get('/alogout',adminlogout)

router.get('/allusers',adminsession,allusers)

router.get('/block/:id',adminsession,userblock)

router.get('/unblock/:id',adminsession,userunblock)

router.get('/category',adminsession,category)

router.get('/addcategory',adminsession,addcategory)

router.post('/addcategory',imagemulter.array('imageurl',3),adminsession,postcategory)

router.get('/deletecategory/:id',adminsession,deletecategory)

router.get('/editcategory/:id',adminsession,editcategory)

router.post('/postecategory/:id',imagemulter.array('imageurl',3),adminsession,postecategory)

router.get('/product',adminsession,product)

router.get('/addproduct',adminsession,addproduct)

router.post('/postaddproduct',imagemulter.array('images',3),adminsession,postaddproduct)

router.get('/deleteproduct/:id',adminsession,deleteproduct)

router.get('/editproduct/:id',adminsession,editproduct)

router.post('/posteditproduct/:id',imagemulter.array('images',3),adminsession,posteditproduct)

router.get('/banner',adminsession,banner)

router.get('/addbanner',adminsession,addbanner)

router.post('/postbanner',imagemulter.array('images',3),postbanner)

router.get('/editbanner/:id',adminsession,editbanner)

router.post('/posteditbanner/:id',imagemulter.array('images',3),adminsession,posteditbanner)

router.get('/deletebanner/:id',adminsession,deletebanner)

router.get('/order',adminsession,orders)

router.get('/orderview/:id',adminsession,orderview)

router.post('/orderstatus',adminsession,orderstatus)

router.get('/error',adminsession,error)

router.get('/coupon',adminsession,coupon)

router.get('/addcoupon',adminsession,addcoupon)

router.post('/postcoupon',adminsession,postcoupon)

router.delete('/coupondelete',adminsession,coupondelete)

router.post('/orderapproval',orderapproval)

module.exports=router
const express=require('express')
const imagemulter=require('../middleware/multer')
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
    salesreport,
    monthlyreport,
    yearlyreport,
    piechart,
    chartdetails,
}=require('../constroller/admincontroller')



const router=express.Router()

router.get('/adashbord',adminsession,admindashbord)
router.get('/',adminlogin)
router.get('/alogout',adminlogout)
router.get('/allusers',adminsession,allusers)
router.get('/block/:id',adminsession,userblock)
router.get('/unblock/:id',adminsession,userunblock)
router.get('/category',adminsession,category)
router.get('/addcategory',adminsession,addcategory)
router.get('/deletecategory/:id',adminsession,deletecategory)
router.get('/editcategory/:id',adminsession,editcategory)
router.get('/product',adminsession,product)
router.get('/addproduct',adminsession,addproduct)
router.get('/deleteproduct/:id',adminsession,deleteproduct)
router.get('/editproduct/:id',adminsession,editproduct)
router.get('/banner',adminsession,banner)
router.get('/addbanner',adminsession,addbanner)
router.get('/editbanner/:id',adminsession,editbanner)
router.get('/deletebanner/:id',adminsession,deletebanner)
router.get('/order',adminsession,orders)
router.get('/orderview/:id',adminsession,orderview)
router.get('/error',adminsession,error)
router.get('/coupon',adminsession,coupon)
router.get('/addcoupon',adminsession,addcoupon)
router.get("/salesreport",adminsession,salesreport)
router.get('/monthlyreport',adminsession,monthlyreport)
router.get('/yearlyreport',adminsession,yearlyreport)
router.get('/piechart',adminsession,piechart)
router.get('/chartdetails',adminsession,chartdetails)

router.post('/',adminlogger)
router.post('/addcategory',imagemulter.array('imageurl',3),adminsession,postcategory)
router.post('/postecategory/:id',imagemulter.array('imageurl',3),adminsession,postecategory)
router.post('/postaddproduct',imagemulter.array('ImageURL',3),adminsession,postaddproduct)
router.post('/posteditproduct/:id',imagemulter.array('images',3),adminsession,posteditproduct)
router.post('/postbanner',imagemulter.array('images',3),postbanner)
router.post('/posteditbanner/:id',imagemulter.array('images',3),adminsession,posteditbanner)
router.post('/orderstatus',adminsession,orderstatus)
router.post('/postcoupon',adminsession,postcoupon)
router.post('/orderapproval',adminsession,orderapproval)

router.delete('/coupondelete',adminsession,coupondelete)



module.exports=router
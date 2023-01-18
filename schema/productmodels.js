const mongoose=require('mongoose')

const productscema=new mongoose.Schema({

    product_name:{
        type:String
    },
    category:{
        type:String
    },
    brand:{
        type:String
    },
    price:{
        type:Number
    },
    stock:{
        type:Number
    },
    images:{
        type:Array
    },
    discription:{
        type:String
    },
    quantity:{
        type:Number,
        default:1
    },actualprice:{
        type:Number
    },
    offer:{
        type:Number,
        default:0
    }
},{timestamps:true})

const Products = mongoose.model('Product',productscema)

module.exports = Products
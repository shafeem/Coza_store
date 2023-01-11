const mongoose=require('mongoose')

const cartscema=new mongoose.Schema({

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    item:[{
        product:{
            type:mongoose.Types.ObjectId,
            ref:'Product'
        },
        price:{
            type:Number
        },
        quantity:{
            type:Number,
            default:1
        },
        total:{
            type:Number
        }

    }]
    ,carttotal:{
        type:Number
    }
})

const Cart= mongoose.model('Cart',cartscema)

module.exports=Cart
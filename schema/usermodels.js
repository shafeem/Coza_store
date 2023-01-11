const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        
        type:String,
        required:true
    },
    access:{
        type:Boolean,
        default:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart'
    },
    wallet:{
        type:Number,
        default:0
    }

},
{timestamps:true})

const User=mongoose.model("User",userSchema)

module.exports=User 
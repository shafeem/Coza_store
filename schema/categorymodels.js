const mongoose=require('mongoose')

const categoryscema= new mongoose.Schema({

    category:{
        type:String
    },
    imageurl:{
        type:Array
    },
    message:{
        type:String
    }

},{timestamps:true})

const Category = mongoose.model('Category',categoryscema)

module.exports=Category
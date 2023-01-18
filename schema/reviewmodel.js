const mongoose= require('mongoose')
const moment=require('moment')

const reviewscema=new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    review: {
        type: String,
        required: true
    },
    name:{
        type:String,
    },
    rating: {
        type: Number
    },
    email:{
        type:String
    },
    date: {
        type: String,
        default: moment(Date.now()).format('DD-MM-YYYY')
    }   
})


const Review = mongoose.model('Review',reviewscema)

module.exports = Review
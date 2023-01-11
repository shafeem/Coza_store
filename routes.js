const express=require('express')
const usermodal=require('./schema/usermodels')
const app=express()

// creating new users----
app.get('/userCreate',async (req,res)=>{
    const user=new usermodal(req.body)

    try {
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }

})

// finding all the users-----
app.get('/getUsers',async (req,res)=>{
    const user=new usermodal.find({})

    try {
        await res.send(user)
    } catch (error) {
        res.status(500).send(error)      
    }
})
module.exports=app
const express=require('express')
const path=require('path')
const logger = require('morgan')
const session=require('express-session')
const app=express()
const dbConn = require('./server')
const dotenv=require('dotenv')
const axios=require('axios')
const moment=require('moment')
dbConn()
dotenv.config()

const userrouter=require('./router/userrouter')
const adminrouter=require('./router/adminrouter')
const cookieParser = require('cookie-parser')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(session({
    secret:"sessionkey",
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:6000000}
}))

app.use(express.json())
app.use(logger('dev'))
app.use(express.static(path.join(__dirname ,'public')))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(express.static(__dirname ,'/public/user/css'))
// var session
app.use('/admin',adminrouter)
app.use('/',userrouter)



app.listen(5000,(req,res)=>{
    console.log('port opened');
})


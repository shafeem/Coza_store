const mongoose=require('mongoose')
const User=require('./schema/usermodels')

// require('dotenv').config();

mongoose.set("strictQuery", false)

async function runConnection(){
    try{
        await mongoose.connect(
            //  "mongodb://127.0.0.1:27017/coza_store",

            'mongodb+srv://royalhub:royalhub@royalhub.56b17fj.mongodb.net/royalhub?retryWrites=true&w=majority',
            
            
             {
                 useNewUrlParser: true,
                 useUnifiedTopology: true,
             }
             );
             console.log('DBConection success');

    }catch(err){
        console.log(err.message);
    }
    }

module.exports = runConnection;

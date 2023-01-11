const multer=require('multer')
 
 const multerStorage= multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,"public/image")
    },
    filename:(req,file,cb)=>{
        const ext =file.mimetype.split("/")[1];
        cb(null, `img-${file.fieldname}-${Date.now()}.${ext}`);
    },

 })
 const uplode= multer({
    storage:multerStorage
   
})

 module.exports=uplode
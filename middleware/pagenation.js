function pagenation(model){
    return async (req,res,next)=>{
        const page=parseInt(req.query.page);
        console.log(page,'1111111111111111');
        const limit=parseInt(req.query.limit)
        console.log(limit,'2222222222222222');
        console.log(page+" "+limit);
        const startIndex=(page-1)*limit;
        console.log(startIndex,'3333333333333333');
        const endInndex=page * limit;
        console.log(endInndex,'4444444444444');
        const results={}
        results.current={page,limit}
        if(endInndex < await model.find().count()){
            results.next={
                page:page+1,
                limit:limit
            }
        }
        if(startIndex>0){
            results.previous={
                 page:page-1,
                 limit:limit
            }
        }
       try{
          results.results= await model.find().limit(limit).skip(startIndex).exec()
          res.pagenation=results
          next()
       }catch(e){
         res.status(500).json({message:e.message })
       }
    }

}
module.exports={
    pagenation
} 
const jwt=require("jsonwebtoken");


function LoginShiled(req,res,next){
try {
    if(req.headers.cookie){
        const token=req.headers.cookie.split("=")[1];
        const isTokenValid=jwt.verify(token,process.env.JWT_SECRET_KEY,{complete:true});
        if(isTokenValid){
            next();
        }
         }
         else {
            return res.status(401).json({message:"Login to Continue"})
        }
} catch (error) {
    return res.status(401).json({
        message:"Token expired."
    })
}
}

module.exports=LoginShiled;
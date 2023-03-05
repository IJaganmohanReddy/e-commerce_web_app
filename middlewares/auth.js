const Custom_errorHandler = require("../services/Custom_errorHandler");
const JwtService = require("../services/jwtService");

const auth=async (req,res,next)=>{
    const auth_header= req.headers.authorization;
    
    if(!auth_header){
        console.log("no token")
        return next(Custom_errorHandler.unauthorized())
    }
   
    const access_token= auth_header.split(" ")[1];

    try {
        const {_id, role}=op= await JwtService.verify(access_token)
        console.log(op)
        const user={
            _id,
            role
        }
        req.user= user;
        next()
    } catch (error) {
        return next(Custom_errorHandler.unauthorized())
    }

}

module.exports= auth
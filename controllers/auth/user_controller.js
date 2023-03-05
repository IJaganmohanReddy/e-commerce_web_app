const { User } = require("../../models");
const Custom_errorHandler = require("../../services/Custom_errorHandler");


const user_controller={
    me: async (req,res,next)=>{
       try {
          const user= await User.findOne({_id: req.user._id}).select(" -__v -password -updatedAt");
          if(!user){
            return next(Custom_errorHandler.notFound("user not found"))
          }
  
          res.status(200).send(user)
          
       } catch (error) {
        next(error)
       }
    }
}


module.exports= user_controller
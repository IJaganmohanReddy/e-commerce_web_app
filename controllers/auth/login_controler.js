const Joi= require('joi')
const {User, Refresh_token}= require('../../models/index')
const Custom_errorHandler = require('../../services/Custom_errorHandler')
const JwtService= require('../../services/jwtService')
const bcrypt= require('bcrypt')
const { JWT_REFRESH_SECRET } = require('../../config')
const login_controller= {

  login:async (req,res,next)=>{

     // validate req.body
        const login_schema= Joi.object().keys({
              email: Joi.string().email().required(),
              password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            })

          const {error}= login_schema.validate(req.body) 
          if(error){
            return next(error)
        } 

     //check for user in db
        let user;
        try {
            user= await User.findOne({email: req.body.email})
            if(!user){
                return next(Custom_errorHandler.wrong_credentials())
            }
        } catch (error) {
            return next(error)
        }
          
     //compare password
        let access_token,refresh_token;
        try {
           const match = await bcrypt.compare(req.body.password, user.password) 
           if(!match){
               return next(Custom_errorHandler.wrong_credentials())
            }
            else{
            //create jwt
                access_token= JwtService.sign({_id:user._id, role: user.role})
                refresh_token=JwtService.sign({_id:user._id, role: user.role},'1y',JWT_REFRESH_SECRET)       
                const data= await Refresh_token.create({refresh_token:refresh_token, is_active:true})
            }
        } catch (error) {
            return next(error)
        }
        
     // send response to the user  
        res.json({msg:"login successfull",access_token,refresh_token,data:user})
    },


    logout: async (req,res,next)=>{
        try {
            const {is_active}= await Refresh_token.findOneAndUpdate({refresh_token: req.body.refresh_token},{$set:{is_active: false}})
            //NOTE: here is_active gives previous state
            if(!is_active){
                return next(Custom_errorHandler.unauthorized("ur ref_token is outdated..r u a thief??"))
            }
        } catch (error) {
            return next(error)
        } 

         res.send("logout successfull")
        }
}

module.exports= login_controller
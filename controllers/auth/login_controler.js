const Joi= require('joi')
const {User}= require('../../models/index')
const Custom_errorHandler = require('../../services/Custom_errorHandler')
const JwtService= require('../../services/jwtService')
const bcrypt= require('bcrypt')
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
        let access_token;
        try {
           const match = await bcrypt.compare(req.body.password, user.password) 
           if(!match){
               return next(Custom_errorHandler.wrong_credentials())
            }
            else{
                //create jwt
                access_token= await JwtService.sign({_id:user._id, role: user.role})
            }
        } catch (error) {
            return next(error)
        }
        
        res.json({msg:"login successfull",jwt:access_token,data:user})
    }

}

module.exports= login_controller
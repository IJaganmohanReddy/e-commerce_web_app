const joi= require('joi')
const Custom_errorHandler= require('../../services/Custom_errorHandler')
const {User, Refresh_token}= require('../../models/index')
const bcrypt= require('bcrypt')
const JwtService= require('../../services/jwtService')
const { JWT_REFRESH_SECRET } = require('../../config')

const register_controller={

register: async(req,res,next)=>{

            const register_schema= joi.object().keys({
            name: joi.string().min(3).max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: joi.ref('password')
        })

        const {error}= register_schema.validate(req.body)
         // here errror will b an object of class ValidationError

         if(error){
            return next(error)
        }

        try {
            const exists= await User.findOne({email: req.body.email})
            if(exists){
                return next(Custom_errorHandler.alreadyExists("email already exists"))
            }
        } catch (err) {
            console.log("catch")
            return next(err)
        }

       const hashedPassword= await bcrypt.hash(req.body.password, 10);
       const {name, email, password}= req.body;
       const user=new User({
          name,
          email,
          password: hashedPassword
       })
       
       let access_token,refresh_token;
       try {
            const result = await user.save()
            access_token=JwtService.sign({_id:result._id, role: result.role});
            refresh_token=JwtService.sign({_id:result._id, role: result.role},'1y',JWT_REFRESH_SECRET)  
            const data= await Refresh_token.create({refresh_token: refresh_token, is_active:true})     
       
        } catch (error) {
          next(error)
       }
       



        res.json({message:"user registered", access_token:access_token, data:req.body})
    }

}

module.exports= register_controller;
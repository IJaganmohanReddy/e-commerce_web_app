const joi= require('joi')
const Custom_errorHandler= require('../../services/Custom_errorHandler')
const {User}= require('../../models/index')
const bcrypt= require('bcrypt')
const JwtService= require('../../services/jwtService')

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
        console.log("================= \n",req.body,error)
        if(error){
            return next(error)
        }

        try {
            const exists= await User.findOne({email: req.body.email})
            if(exists){
                console.log("alreagr exists")
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
       
       let access_token;
       try {
            const result = await user.save()
            console.log("**",result)
            //token 
            access_token=JwtService.sign({_id:result._id, role: result.role})
       
       
        } catch (error) {
          next(error)
       }
       



        res.json({message:"user registered", access_token:access_token, data:req.body})
    }

}

module.exports= register_controller;
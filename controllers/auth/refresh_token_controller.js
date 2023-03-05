const Joi = require("joi")
const { JWT_REFRESH_SECRET } = require("../../config")
const { Refresh_token } = require("../../models")
const Custom_errorHandler = require("../../services/Custom_errorHandler")
const JwtService = require("../../services/jwtService")

const refresh_token_controller={
    refresh_token: async(req,res,next)=>{
    //token exists? and  active?    mark old token inactive
        
        const refresh_schema= Joi.object().keys({
            refresh_token: Joi.string().required(),
        })

        try {
            const {error}= refresh_schema.validate(req.body)
            if(error){
                return next(error)
            }
        } catch (error) {
            return next(error)
        }
    
         try {
            const {is_active}= await Refresh_token.findOneAndUpdate({refresh_token: req.body.refresh_token},{$set:{is_active: false}})
            //NOTE: here is_active gives previous state
            if(!is_active){
                return next(Custom_errorHandler.unauthorized("ur ref_token is outdated..r u a thief??"))
            }
         } catch (error) {
            return next(error)
         }  
    
     //issue new tokens
        let access_token,refresh_token
        try {
            const payload= await JwtService.verify(req.body.refresh_token, JWT_REFRESH_SECRET);
            access_token= JwtService.sign({_id:payload._id, role: payload.role})
            refresh_token=JwtService.sign({_id:payload._id, role: payload.role},'1y',JWT_REFRESH_SECRET)       
            
            console.log(payload,access_token,refresh_token)
            await Refresh_token.create({refresh_token,is_active:true})
        } catch (error) {
            console.log(error)
            return next(error)
        }

        res.json({access_token,refresh_token})
    }
}

module.exports= refresh_token_controller
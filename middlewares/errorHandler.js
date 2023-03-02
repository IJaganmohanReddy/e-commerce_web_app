const {DEBUG_MODE}= require('../config/index')
const {ValidationError} =require('joi');
const Custom_errorHandler = require('../services/Custom_errorHandler');

const errorHandler= (err,req,res,next)=>{
     //console.log(err)
     let statusCode= 500;
     let data= {
        message: 'Internal server error',
        ...(DEBUG_MODE==='true' && {originalError: err.message})
     }

     if(err instanceof ValidationError){
        statusCode= 422
        data={
               message:err.message
            }
     }

     if(err instanceof Custom_errorHandler){
      statusCode= err.statusCode;
      data={
         message: err.message
      }
     }

     return res.status(statusCode).json(data)

    }

module.exports= errorHandler
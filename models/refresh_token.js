const { bool } = require('joi')
const mongoose= require('mongoose')

const refresh_token_schema= new mongoose.Schema({
    refresh_token:{type:String,required:true,unique:true},
    is_active: {type:Boolean,required: true}
})

module.exports= new mongoose.model("Refresh_token",refresh_token_schema,"refresh_tokens")
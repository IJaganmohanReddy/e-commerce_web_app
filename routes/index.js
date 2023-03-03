const express= require('express')
const router= express.Router()

const {register_controller, login_controller}= require('../controllers/index')



router
.post('/register',register_controller.register)
.post('/login',login_controller.login)
module.exports= router
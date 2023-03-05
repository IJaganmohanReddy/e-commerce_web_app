const express= require('express')
const router= express.Router()
const auth = require('../middlewares/auth')

const { register_controller,
        login_controller,
        user_controller,
        Refresh_token_controller,
    }= require('../controllers/index')



router
.post('/register',register_controller.register)
.post('/login',login_controller.login)
.get('/me',auth,user_controller.me)
.post('/refresh',Refresh_token_controller.refresh_token)
.post('/logout',auth,login_controller.logout)

module.exports= router
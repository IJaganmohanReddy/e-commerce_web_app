const express= require('express')
const router= express.Router()

const controllers= require('../controllers/index')



router.post('/register',controllers.register_controller.register)

module.exports= router
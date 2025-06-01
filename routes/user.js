const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.get('/register',auth.isLogin,userController.loadRegister)
router.post('/register',userController.registerUser)

router.get('/login',auth.isLogin,userController.loadLogin)
router.post('/login',userController.login)

router.get('/home',auth.checkSession,userController.loadHome)
router.get('/logout',auth.checkSession,userController.logout)
   


module.exports = router
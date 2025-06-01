const express = require('express')
const router = express.Router();
const adminController = require('../controllers/adminController')

router.get('/dashboard',adminController.loadDashboard)
router.delete('/user/:id',adminController.deleteUser)
router.post('/user/:id',adminController.updateUser)

module.exports = router
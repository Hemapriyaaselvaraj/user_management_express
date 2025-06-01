const adminModel = require('../model/adminModel')
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel')

const loadDashboard = async(req,res) => {
      
        const isAdmin = req.session.role == 'admin';
        if(!isAdmin) return res.redirect('/user/home')
        
        const users = await userModel.find({});
        res.render('admin/adminHome',{users})
}

const deleteUser = async(req,res) => {
    
    await userModel.deleteOne({_id: req.params.id});

    res.status(200).send();
}


module.exports = {loadDashboard, deleteUser}
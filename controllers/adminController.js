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

const updateUser = async(req,res) => {

    var myquery = { _id: req.params.id };
    var newvalues = { $set: {email: req.body.email, password:req.body.password } };
    await userModel.updateOne(myquery, newvalues)
    res.redirect('/admin/dashboard')
}


module.exports = {loadDashboard, deleteUser,updateUser}
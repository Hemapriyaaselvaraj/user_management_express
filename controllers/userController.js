const userModel = require('../model/userModel')
const bcrypt = require('bcrypt');
const saltround = 10;

const registerUser = async(req,res) => {
    try{
     
        const {email,password,role} = req.body

        const user =  await userModel.findOne({email})

        if(user)  return res.render('user/login', { message: 'User already exists'}) 

        const hashedPassword = await bcrypt.hash(password,saltround);
        

        const newUser = new userModel ({
            email,
            password : hashedPassword,
            role
        })

        await newUser.save()


      res.render('user/login', { message: 'User created successfully' });


    }catch(error) {
    

        res.render('user/register', { message: 'Something went wrong. Please try again.' });


    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/user/login');
    });
};


const login = async(req,res) => {
    try{
       
        const{email,password} = req.body

        const user = await userModel.findOne({email})

        if(!user) return res.render('user/login', {message: 'User doesnot exist'})

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return res.render('user/login', {message: 'Incorrrect password'})

         req.session.user = true
         req.session.role = user.role;

       if(user.role == "user"){
        res.redirect('/user/home')
       }else{
       res.redirect('/admin/dashboard')
       }



    }catch(error)  {

       res.render('user/register', { message: 'Something went wrong. Please try again.' });


    }
}

const loadRegister = (req,res) => {
    res.render('user/register')
}

const loadLogin = (req,res) => {
    res.render('user/login')
}

const loadHome = (req,res) => {
    const isUser = req.session.role == "user"
    if(!isUser) {
       res.redirect('/admin/dashboard')
    }else{
         res.render('user/userHome')
    }
}

module.exports = 
{
    registerUser ,
    loadRegister ,
    loadLogin,
    login,
    loadHome,
    logout
}
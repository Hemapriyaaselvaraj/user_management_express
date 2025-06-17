const express = require('express')
const app = express();
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const path = require('path');
const connectDB = require('./db/connectDB')
const session = require('express-session')
const nocache = require('nocache');
const hbs = require("express-handlebars");
require('dotenv').config();

app.use(nocache())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24
    }
}))

app.engine("hbs", hbs.engine({
  extname: "hbs",
  helpers: {
    add: (a, b) => a + b
  }
}));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)


connectDB();

app.listen(3001,()=> {
    console.log("Server started at: http://localhost:3001");
})

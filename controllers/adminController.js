const adminModel = require("../model/adminModel");
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");

const loadDashboard = async (req, res) => {
  const isAdmin = req.session.role == "admin";
  if (!isAdmin) return res.redirect("/user/home");

  let users;
  if(req.query.email){
    users = await userModel.find({ email: new RegExp(req.query.email, 'i') }).lean()
  } else {
     users = await userModel.find({}).lean();
  }

  const filteredUsers = users.filter(user => !user._id.equals( req.session.userId));

  res.render("admin/adminHome", { users: filteredUsers });
};


const deleteUser = async (req, res) => {
  await userModel.deleteOne({ _id: req.params.id });

  res.status(200).send();
};

const updateUser = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user && user._id != req.params.id) {
    req.flash("error", "Username already in use");
    return res.redirect("/admin/dashboard");
} else {
    var myquery = { _id: req.params.id };
    var newvalues = {
      $set: { email: req.body.email, password: req.body.password },
    };
    await userModel.updateOne(myquery, newvalues);
    res.redirect("/admin/dashboard");
  }
};

const createUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    req.flash("error", "User already exist");
    return res.redirect("/admin/dashboard");
  } else {
    const newUser = { email: email, password: password, role: 'user' };
    await userModel.create(newUser);
    res.redirect("/admin/dashboard");
  }
};

module.exports = { loadDashboard, deleteUser, updateUser, createUser };

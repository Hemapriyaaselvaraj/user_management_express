const adminModel = require("../model/adminModel");
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");

const loadDashboard = async (req, res) => {
  const isAdmin = req.session.role == "admin";
  if (!isAdmin) return res.redirect("/user/home");

  let users;
  if(req.query.email){
    users = await userModel.find({ email: new RegExp(req.query.email, 'i') })
    console.log("email", JSON.stringify(users));
  } else {
     users = await userModel.find({});
  }

  if (req.query.message) {
    res.render("admin/adminHome", { users, message: req.query.message });
  } else {
    res.render("admin/adminHome", { users });
  }
};


const deleteUser = async (req, res) => {
  await userModel.deleteOne({ _id: req.params.id });

  res.status(200).send();
};

const updateUser = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user && user._id != req.params.id) {
    res.redirect("/admin/dashboard?message=Username_already_in_use");
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
  const { email, password, role } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    res.redirect("/admin/dashboard?message=User_already_exists");
  } else {
    const newUser = { email: email, password: password, role: role };
    await userModel.create(newUser);
    res.redirect("/admin/dashboard");
  }
};

module.exports = { loadDashboard, deleteUser, updateUser, createUser };

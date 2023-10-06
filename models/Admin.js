// const mongoose = require('mongoose');
//   const adminSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//   });
//   const Admin = mongoose.model("Admin", adminSchema);
//   module.exports = Admin;

  const mongoose = require('mongoose');

  const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String, // Unique identifier provided by Google
    displayName: String, // User's display name
    // Other fields as needed
  });
  
  const Admin = mongoose.model('Admin', adminSchema);
  module.exports = Admin;
  
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  isActive: { type: Boolean, default: true },
});
const User = mongoose.model('User', userSchema);
module.exports = User;

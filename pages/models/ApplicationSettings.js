const mongoose = require('mongoose');

const applicationSettingsSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true, 
  },
  botToken: {
    type: String,
    required: true, 
  },
});
const ApplicationSettings = mongoose.model('ApplicationSettings', applicationSettingsSchema);

module.exports = ApplicationSettings;





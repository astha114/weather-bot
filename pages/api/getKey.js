const mongoose = require('mongoose');
const db = require('../api/db')

const settingsSchema = new mongoose.Schema({
  apiKey: String,
  botToken: String,
});

const Settings = mongoose.model('applicationsettings', settingsSchema);

const getApiKeysFromDatabase = async () => {
  try {
    const settings = await Settings.findOne();
    if (settings) {
      const { apiKey, botToken } = settings;
      return { apiKey, botToken };
    }
    console.log(apiKey)
    return { apiKey: '', botToken: '' }; 
  } catch (error) {
    console.error('Error fetching API keys from the database:', error);
    return { apiKey: '', botToken: '' }; 
  }
};

module.exports = {
    getApiKeysFromDatabase,
  };

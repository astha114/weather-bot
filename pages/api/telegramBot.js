require('dotenv').config();
const express = require('express');
const axios = require("axios");
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const bcrypt = require("bcrypt");
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { getApiKeysFromDatabase } = require('./getKey');
const User = require('../../models/User')
const Admin = require('../../models/Admin')
const ApplicationSettings = require('../../models/ApplicationSettings')
const db = require('../api/db');

const app = express();
const PORT = process.env.PORT || 3002;
const defaultApiKey = process.env.YOUR_DEFAULT_API_KEY
const defaultBotToken = process.env.YOUR_DEFAULT_BOT_TOKEN


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure session
app.use(session({ secret: '234aa4890565099b1f697a2982e6650e', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());
  app.get('/api/getUsers', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post("/api/googleSignup", async(req,res)=>{
  const { username } = req.body;
  const existingUser = await Admin.findOne({ username });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(username, 10);
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });
    await newAdmin.save();
    console.log('added user')
  }
})
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      alert('Username already in use')
      return res.status(400).json({ error: "Username already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error while signing up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/api/getSettings', async (req, res) => {
  try {
    const settings = await ApplicationSettings.findOne();

    if (settings) {
      res.json(settings);
    } else {
      res.status(404).json({ message: 'Settings not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/updateSettings', async (req, res) => {
  try {
    const { apiKey, botToken } = req.body;

    const settings = await ApplicationSettings.findOneAndUpdate(
      {}, 
      { apiKey, botToken }, 
      { new: true }
    );

    if (settings) {
      res.status(200).json({ message: 'Settings updated successfully' });
    } else {
      res.status(404).json({ message: 'Settings not found' });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Admin.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  app.delete('/api/deleteUser/:telegramId', async (req, res) => {
    try {
      const telegramId = req.params.telegramId;
      const deletedUser = await User.findOneAndDelete({ telegramId });
  
      if (deletedUser) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/api/toggleUserStatus/:telegramId', async (req, res) => {
    try {
      const telegramId = req.params.telegramId;
      const { isActive } = req.body;

      await User.updateOne({ telegramId }, { $set: { isActive } });
      res.status(200).json({ message: `User ${isActive ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
      console.error('Error toggling user status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/api/register', async (req, res) => {
    try {
      const { telegramId, username, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ telegramId });
      if (existingUser) {
        return res.status(400).json({ message: 'User already registered' });
      }
  
      const newUser = new User({
        telegramId,
        username,
        firstName,
        lastName,
      
      });
  
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

async function initializeBot() {
  const { apiKey, botToken } = await getApiKeysFromDatabase();
  const TELEGRAM_BOT_TOKEN = botToken || defaultBotToken
  const OPENWEATHERMAP_API_KEY = apiKey || defaultApiKey
  console.log(apiKey)
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

  bot.on('message', async (msg) => {
    const user = await User.findOne({ telegramId: msg.from.id });
    if (!user) {
      await registerUserFromTelegram(msg);
    }
    const chatId = msg.chat.id;
    const userInput = msg.text;
    try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${OPENWEATHERMAP_API_KEY}`
            );
            
            const data = response.data;
            const weather = data.weather[0].description;
            const temperature = data.main.temp - 273.15;
            const city = data.name;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const windSpeed = data.wind.speed;
            const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;
        
            bot.sendMessage(chatId, message);
          } catch (error) {
            console.log(error)
            bot.sendMessage(chatId, "City doesn't exist.");
    }
  });
  
}

  async function registerUserFromTelegram(msg) {
    
    try {
      const { id: telegramId, username, first_name: firstName, last_name: lastName } = msg.from;
      const newUser = new User({
        telegramId,
        username,
        firstName,
        lastName,
      
      });
  
      await newUser.save();
      console.log(`User ${telegramId} registered from Telegram.`);
    } catch (error) {
      console.error('Error registering user from Telegram:', error);
    }
  }
  initializeBot();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  

  
  
  
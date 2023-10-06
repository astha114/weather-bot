import React, { useState, useEffect } from 'react';

const ApplicationSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [botToken, setBotToken] = useState('');

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://weather-bot-qy9g.onrender.com/api/getSettings'); 
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey);
        setBotToken(data.botToken);
      } else {
        console.error('Error fetching settings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const response = await fetch('https://weather-bot-qy9g.onrender.com/api/updateSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, botToken }),
      });

      if (response.ok) {
        alert('Settings saved successfully');
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div>
      <h2>Application Settings</h2>
      <div className="mb-3">
        <label htmlFor="apiKey" className="form-label">API Key:</label>
        <input
          type="text"
          id="apiKey"
          className="form-control"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="botToken" className="form-label">Bot Token:</label>
        <input
          type="text"
          id="botToken"
          className="form-control"
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
        />
      </div>
      <button onClick={saveSettings} className="btn btn-dark">Save Settings</button>
    </div>
  );
};

export default ApplicationSettings;

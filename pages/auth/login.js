import { useState } from "react";
import {signIn, useSession} from 'next-auth/react'
import Link from 'next/link';
const LoginPage = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    const { username, password } = formData;

    try {
      const response = await fetch("https://weather-bot-qy9g.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 200) {
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
        window.location.href = "https://astha114.github.io/weather-bot/dashboard";
      } 
      else if (response.status === 401) {
        alert("Incorrect password");
      } 
      else if (response.status === 404) {
        alert("User not found");
      } 
      else {
        alert("Error while logging in");
      }
    } 
    catch (error) {
    console.error("Error while logging in:", error);
    }
  };

  const handleGoogleLogin = (e)=>{
    e.preventDefault()
    signIn('google',{ callbackUrl: 'https://astha114.github.io/weather-bot/dashboard' })
    const userEmail = 'gmail'
    localStorage.setItem("authToken", userEmail);
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="border p-4 rounded">
      <h2 className="text-center mb-4">Login</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex flex-column justify-content-center">
        <button
          type="button"
          className="btn btn-dark btn-block"
          onClick={handleLogin}
        >
          Login
        </button>
        <div className="d-flex m-2 justify-content-center">
            ------ OR ------
          </div>
          <button
              type="button"
              className="btn btn-dark btn-block"
              onClick={(e)=>handleGoogleLogin(e)}
            >
              Sign in with Google
          </button>
        </div>
        
      </form>
    <div className="m-2">Do not have acoount? <Link href="https://astha114.github.io/weather-bot/auth/signup">Register</Link></div>
    </div>
  </div>
  );
};

export default LoginPage;

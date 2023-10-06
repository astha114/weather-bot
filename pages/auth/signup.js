import { useState } from "react";
import {signIn, useSession} from 'next-auth/react'
import Link from 'next/link';

const SignupPage = () => {
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

 const handleGoogleSignup = ()=>{
    signIn('google',{ callbackUrl: 'https://astha114.github.io/weather-bot/dashboard' })
    const userEmail = 'gmail'
    localStorage.setItem("authToken", userEmail);
 }

  const handleSignup = async () => {
    const { username, password } = formData;

    try {
      const response = await fetch("https://weather-bot-qy9g.onrender.com/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 201) {
        alert('Account Created!!')
        window.location.href = "https://astha114.github.io/weather-bot/auth/login";
      } else {
        alert('Username already in use!')
        console.error("Error while signing up:", response.statusText);
      }
    } catch (error) {
      console.error("Error while signing up:", error.message);
    }
  };


  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="border p-4 rounded">
        <h2 className="text-center mb-4">Sign Up</h2>
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
              onClick={handleSignup}
            >
              Sign Up
          </button>
          <div className="d-flex m-2 justify-content-center">
            ------ OR ------
          </div>
          <button
              type="button"
              className="btn btn-dark btn-block"
              onClick={handleGoogleSignup}
            >
              Sign up with Google
          </button>
          </div>
         

        </form>
        <div className="m-2">Already have an acoount? <Link href="/auth/login">Login</Link></div>
      </div>
    </div>
  );
};

export default SignupPage;

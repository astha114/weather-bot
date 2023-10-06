import React, { useEffect } from 'react';
import UserManagement from './UserManagement';
import ApplicationSettings from './ApplicationSettings';
import Navigation from '../components/Navigation'
import PrivateRoute from './Auth';
import {useSession, signIn} from 'next-auth/react'

const AdminDashboard = () => {
  const { data: session } = useSession();
  const save = async ()=>{
    if (session) {
      const username = session.user.email
      const response = await fetch("https://weather-bot-qy9g.onrender.com/api/googleSignup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            username,
          }),
        });

        if (response.status === 200) {
          console.log('saved user')
        }
      console.log('Logged-in user email:', session.user);
    }
    
  }
  save();
  return (
     <PrivateRoute>
      <div className="container py-4">
        <header className="text-center">
          <h1>Welcome to the Admin Dashboard</h1>
          <p className="lead">Manage your application with ease.</p>
        </header>

        <main>
          <section id="users" className="my-4">
            
            <UserManagement />
            <p>Manage your users, block or delete accounts, and view user data.</p>
          </section>

          <section id="settings" className="my-4">
            
            <ApplicationSettings />
            <p className='m-2'>Configure your application settings, including bot API keys.</p>
          </section>

          <Navigation />
        </main>

        <footer className="text-center mt-4">
          <p>&copy; {new Date().getFullYear()} Your Company Name</p>
        </footer>
      </div>
      </PrivateRoute>
  );
};

export default AdminDashboard;

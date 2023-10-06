import React from "react";
import {useSession, signIn, signOut} from 'next-auth/react'
const Navigation = () => {
  const handleSignOut = () => {
    
    localStorage.removeItem("authToken");
    signOut({ callbackUrl: '/auth/login' })
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <button
        className="btn btn-dark me-2"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navigation;

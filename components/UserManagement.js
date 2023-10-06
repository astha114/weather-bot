import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([{}]);

  useEffect(() => {
    fetch('https://weather-bot-qy9g.onrender.com/api/getUsers')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);

  const deleteUser = (telegramId) => {
    fetch(`https://weather-bot-qy9g.onrender.com/api/deleteUser/${telegramId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
      
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.telegramId !== telegramId)
          );
        } else {
          console.error('Error deleting user:', response.status);
        }
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const toggleUserStatus = (telegramId, isActive) => {
    fetch(`https://weather-bot-qy9g.onrender.com/api/toggleUserStatus/${telegramId}`, {
      method: 'POST', 
      body: JSON.stringify({ isActive: !isActive }), 
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.telegramId === telegramId
                ? { ...user, isActive: !isActive } 
                : user
            )
          );
        } else {
          console.error('Error toggling user status:', response.status);
        }
      })
      .catch((error) => console.error('Error toggling user status:', error));
  };

  const saveUserChanges = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <h2 className="mb-4">User Management</h2>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Telegram ID</th>
            <th>Username</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.telegramId}</td>
              <td>{user.firstName}</td>
              <td>
                <span
                  className={`badge bg-${
                    user.isActive ? 'success' : 'danger'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Blocked'}
                </span>
              </td>
              <td>
                <button
                  className={`btn btn-sm btn-${
                    user.isActive ? 'danger' : 'success'
                  } me-2`}
                  onClick={() => toggleUserStatus(user.telegramId, user.isActive)}
                >
                  {user.isActive ? 'Block' : 'Unblock'}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteUser(user.telegramId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <div>
          <h3>Edit User</h3>
          <button
            className="btn btn-dark"
            onClick={saveUserChanges}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

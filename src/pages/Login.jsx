import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      }, {
        withCredentials: true  // 🔥 IMPORTANT
      });
  
      console.log(res.data);
      // maybe store res.data.user in state/context
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-96">
        <h2 className="text-xl font-bold">Login</h2>
        <input type="text" placeholder="Username" required
          className="w-full border p-2 rounded" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" required
          className="w-full border p-2 rounded" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}

export default Login;

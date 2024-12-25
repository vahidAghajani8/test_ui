import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Login.module.css';
import { Button, message } from 'antd';

function ResetPassword() {
  const { token } = useParams();  // Use useParams to get the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');  
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Password must contain at least one letter.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      messageApi.open({ type: 'error', content: 'Passwords do not match.', duration: 5 });
      return;
    }

    const passwordError = validatePassword(password);    
    if (passwordError) {
      messageApi.open({ type: 'error', content: passwordError, duration: 5 });      
      return;
    }


    try {
      const response = await fetch(`/request/reset_password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) {
        messageApi.open({ type: 'error', content: data.error, duration: 5 });  
      }

      
      messageApi.open({ type: 'success', content: data.message, duration: 5 });
     
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      messageApi.open({ type: 'error', content: err.message, duration: 5 });       
        
    }
  };

  return (
    <>
    {contextHolder}
      <div className={styles.backgroundImage}></div>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8 w-full max-w-6xl">
          <div className={`text-center lg:text-left mb-6 lg:mb-0 lg:w-1/2 ${styles.loginTitle}`}>
            <h1 className="text-black text-5xl font-bold">SMART</h1>
            <h2 className="text-black text-5xl font-bold">INVESTMENT</h2>
            <p className="text-black mt-4 decoration-orange-100">Track Your investments and find new opportunities.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md lg:w-1/2 card-metallic">
            <form onSubmit={handleReset}>
              <div className="mb-4">
                <label className="block text-gray-700">New Password:</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg bg-white text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg bg-white text-black"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}              
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;

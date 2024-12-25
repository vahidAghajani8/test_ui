import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { message, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');  
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('request/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        messageApi.open({ type: 'error', content: data.error, duration: 20 });
      }
      
      if (data.available){
        messageApi.open({ type: 'success', content: data.message, duration: 20 });
      }
      if (!data.available){
        messageApi.open({ type: 'error', content: data.message, duration: 20 });
      }
      
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {            
      messageApi.open({ type: 'error', content: err.message, duration: 20 });
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
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required/>  

          </div>          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"            
          >
            Reset Password
          </button>
        </form>        
        <div className="mt-4">
          <a onClick={() => navigate('/')} className="text-blue-500 cursor-pointer">Back to Login page</a>
        </div>
        
        </div>
      </div>
    </div>
    </>
  );
}

export default ResetPassword;

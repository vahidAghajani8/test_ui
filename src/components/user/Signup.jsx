import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Button, message, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function Signup() {
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(password);    
    if (passwordError) {
      messageApi.open({ type: 'error', content: passwordError, duration: 5 });      
      return;
    }

    if (password !== rePassword) {
      messageApi.open({ type: 'error', content: 'Passwords do not match.', duration: 5 });       
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/request/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, re_password: rePassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        messageApi.open({ type: 'error', content: errorData.error, duration: 5 });
        throw new Error(errorData.error || 'Signup failed');
      }

      const data = await response.json();
      messageApi.open({ type: 'success', content: 'Sign up successfully. we sent you a link. Please check your Email', duration: 5 });
      // Delay navigation by 5 seconds
      setTimeout(() => {
        navigate('/', { state: { data } });
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (err) {     
      messageApi.open({ type: 'error', content: 'Sign up failed.', duration: 5 });       
    } finally {
      setLoading(false);
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
          required/>
            
          </div>          
          <div className="mb-4">
          <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
           />
           
          </div>
          <div className="mb-4">
            <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="re-type Password"
                    value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            required
            />            
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            loading={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-4">
          <a onClick={() => navigate('/')} className="text-blue-500 cursor-pointer">Already have an account? Login</a>
        </div>
        
        </div>
      </div>
    </div>
    </>
  );
}

export default Signup;

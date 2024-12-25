import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { Button, message, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import googleIcon from '../../assets/googleIcon.png';
import appleIcon from '../../assets/appleIcon.png';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth();
  // const { login } = useAuth();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  

  const handleSubmit = async (e) => {
    e.preventDefault();    
    if (!validateEmail(email)) {
      messageApi.open({ type: 'error', content: 'Invalid email address.', duration: 5 }); 
      
      return;
    }   
    setLoading(true);
    try {
      const success = await login({ email, password, remember });
      
      if (success) {
        messageApi.success('Login successful.');
        navigate('/home');
      } else {
        messageApi.error('Login failed.');
      }
    } catch (err) {
      messageApi.open({ type: 'error', content: err.message, duration: 10 });
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
          <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md lg:w-1/3 card-metallic">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">                
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="username or Email" type="email" value={email}
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
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a onClick={() => navigate('/reset-password-request')} className="text-blue-500 cursor-pointer">Forgot password?</a>
              </div>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
              {/* <div>
                <p className="text-gray-700 flex justify-center">Or</p>
                <div className="space-y-2">
                  <Button className="w-full" icon={<img src={googleIcon} alt="Google" className="h-5 w-5" />} onClick={() => { messageApi.open({ type: 'error', content: "Sorry. we have not implemented that yet :)", duration: 5 });   }}>
                    Continue with Google
                  </Button>
                  <Button className="w-full" icon={<img src={appleIcon} alt="Apple" className="h-5 w-5" />} onClick={() => { messageApi.open({ type: 'error', content: "Sorry. we have not implemented that yet :)", duration: 5 });   }}>
                    Continue with Apple
                  </Button>
                </div>
              </div> */}
              <div className="mt-6 text-center">
                <Button type="link" onClick={() => navigate('/signup')}>
                  Create New Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

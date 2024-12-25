import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Result } from 'antd';


function ConfirmEmail() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [confirmationMessage, setConfirmationMessage] = useState('');


  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`/request/confirm/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Confirmation failed');
        }
        setConfirmationMessage(data.message);
        setTimeout(() => {
          navigate('/');
        }, 4000); // Redirect after 3 seconds
      } catch (err) {
        console.error('Confirmation failed:', err);
        setConfirmationMessage(err.message || 'Confirmation failed. Please try again.');
      }
    };

    confirmEmail();
  }, [token, navigate, messageApi]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {contextHolder}
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
      <Result status="success" title={confirmationMessage} />        
        
      </div>
    </div>
  );
}

export default ConfirmEmail;

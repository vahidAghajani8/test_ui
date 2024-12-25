import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message, Result } from 'antd';

function SuccessPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showHomeLink, setShowHomeLink] = useState(false); // State to manage link visibility
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const successPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const session_id = params.get('session_id');

        if (!session_id) {
          throw new Error('Session ID not found');
        }

        console.log(session_id);

        const response = await fetch(`/request/success/${session_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Confirmation failed');
        }

        // Show the link after 3 seconds
        setTimeout(() => setShowHomeLink(true), 3000);

        // Optionally, redirect to dashboard after 5 seconds
        setTimeout(() => navigate('/'), 5000);
        
      } catch (err) {
        console.error('Confirmation failed:', err);
        // Handle error case (e.g., show error message)
      }
    };

    successPayment();
  }, [location, navigate, messageApi]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {contextHolder}
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <Result status="success" title="Payment successful" />
        {showHomeLink && (
          <div>
            <a href="/" className="text-blue-500 hover:underline">
              Click here to go back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuccessPayment;

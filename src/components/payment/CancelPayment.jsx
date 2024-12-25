import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

const CancelPayment = () => {        
    const navigate = useNavigate();
    return (
      <div className="min-h-screen flex items-center justify-center p-4">        
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            <Result status="error" title="Payment Failed" 
                    extra={[<Button type="primary" key="console" onClick={() => navigate('/home')}> Back to Home </Button>]}>
            </Result>  
        </div>        
      </div>
    );
};

export default CancelPayment;
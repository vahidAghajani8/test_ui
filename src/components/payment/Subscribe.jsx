import React, { useState, useEffect } from 'react';
import { Button, message, Card, Row, Col, Tabs, Typography } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import TopNavbar from '../Navbar/TopNavbar';
import { loadStripe } from '@stripe/stripe-js';
import InvoiceHistory from './InvoiceHistory'; // Adjust the import path as necessary


const { Title, Paragraph } = Typography;
const stripePromise = loadStripe("pk_test_51PKFebDHHy8mKotJQ1rM2cmnkdxwMJ9Xu92YspMyUr5VoE0EqQZofsfjTQuadlKrI6aD1s1UT8AGhtEpQXOpBhzB00zRDLQ0VB");
const MONTHLY_SUBSCRIBE_PRICE_ID = 'price_1PQwY6DHHy8mKotJXB1B8FZq';
const YEARLY_ONE_TIME_PRICE_ID = 'price_1PKmS3DHHy8mKotJOaQkXBdu';

function Subscribe() {
  const [userPlan, setUserPlan] = useState('');
  const [customerID, setCustomerID] = useState(false); // Add this line
  const [userEmail, setUserEmail] = useState(''); // Add this line
  const [validDate, setValidDate] = useState('');
  const [messageApi, contextHolder] = message.useMessage();    
  const [showPremiumPlan, setShowPremiumPlan] = useState(false);
  const currentDate = new Date();  
  
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await fetch(`/request/get_plan`);
        if (!response.ok) {
          throw new Error('Failed to fetch user plan');
        }
        const data = await response.json();
        
        // Format the date to only show the date part
        const formattedDate = new Date(data.valid_date).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        setUserPlan(data.plan);
        setValidDate(formattedDate);
        setCustomerID(data.customer_id); // Add this line
        setUserEmail(data.email); // Add this line
        // console.log(data)

        // Check if the valid date has passed or if the plan is trial
        const validDateObj = new Date(data.valid_date);
        
        if (validDateObj < currentDate || data.plan.toLowerCase() === 'trial') {
          setShowPremiumPlan(true);
        } else {
          setShowPremiumPlan(false);
        }

      } catch (error) {
        messageApi.open({ type: 'error', content: error.message, duration: 10 });
      }
    };

    fetchUserPlan();
  }, []);

  const handleSubmit = async (priceId) => {
    try {
      const response = await fetch('/request/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const data = await response.json();
      if (data.status){
        // Redirect to Stripe checkout
        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({
          sessionId: data.id,
        });
        messageApi.success('Redirecting to checkout...');
        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        messageApi.open({ type: 'success', content: data.message, duration: 10 });
      }     
      
    } catch (err) {      
      messageApi.open({ type: 'error', content: err.message, duration: 10 });
    }
  };

  const handleClick = (priceId) => {
    handleSubmit(priceId);
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('request/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cancellation failed');
      }

      const data = await response.json();
      messageApi.open({ type: 'success', content: data.message, duration: 10 });
      setUserPlan('canceled');         
      setValidDate(`${data.last_valid_date}`);
      setShowPremiumPlan(true);
    } catch (error) {
      messageApi.open({ type: 'error', content: error.message, duration: 10 });
    }
  };

  return (
    <>
      {contextHolder}
      <TopNavbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Row>
          <Col span={24} className="text-center" style={{paddingBottom: "20px"}}>
            <p>{userEmail}</p>            
          </Col>
        </Row>
        <Row >
        {userPlan === 'canceled' ? (
          <p className="text-red-500">You have canceled your subscription. You can use it until the last day of validation.</p>
          ): 
          new Date(validDate) < currentDate ?  (
            <p className="text-red-500">Your subscription has expired. Please renew your subscription to continue using the service.</p>
          ) : (
            <p>You are using a {userPlan} membership.</p>
          )
        }          
            
        </Row>
        <Row>
            <p style={{fontSize: 16}}>Last Valid date: {validDate}</p>
        </Row>
        <Row style={{marginBottom: '100px'}}>
            {((userPlan === 'Monthly plan' || userPlan === 'Yearly plan') && (new Date(validDate) > currentDate)) && (
              <Button danger  className="mb-4" onClick={handleCancelSubscription} style={{ marginTop: '10px' , fillColor: 'red'}}>
                Cancel Subscription
              </Button>
            )}          
        </Row>
        {showPremiumPlan && (
          <>
            <Title level={2} className="text-center">Upgrade your plan</Title>
            <Tabs defaultActiveKey="1" centered className="mb-8">
              <Tabs.TabPane tab="Monthly" key="1">
                <Card className="max-w-md mx-auto">
                  <Title level={4}>Monthly subscription</Title>
                  <Paragraph className="text-gray-500">USD $3.99/month</Paragraph>                  
                  <ul className="list-disc pl-5">
                    <li>Pay as you go</li>
                    <li>Renewal automatic until you cancel the plan</li>
                    <li>Access to advanced data analysis, file uploads and vision</li>
                    <li>Cancel anytime</li>                    
                  </ul>                  
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                    <Button type="primary" className="mb-4" onClick={() => handleClick(MONTHLY_SUBSCRIBE_PRICE_ID)}>Subscribe</Button>
                  </div>
                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Yearly" key="2">
              <Card className="max-w-md mx-auto">
                  <Title level={4}>1 Year subscription</Title>
                  <Paragraph className="text-gray-500">USD $39.99/month</Paragraph>                  
                  <ul className="list-disc pl-5">
                    <li>Pay Once for 1 year subscription</li>
                    <li>No Automatic renewal</li>
                    <li>Access to advanced data analysis, file uploads, and vision</li>
                    <li>Cancel automatic by the end of the vlidation</li>                    
                  </ul>                  
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                    <Button type="primary" className="mb-4" onClick={() => handleClick(YEARLY_ONE_TIME_PRICE_ID)}>Subscribe</Button>
                  </div>
                </Card>
              </Tabs.TabPane>
            </Tabs>          
          </>          
        )}
        
      
      {customerID && (
          
            <InvoiceHistory customerID={customerID}/>
      )};
      </div>
    </>
  );
}

export default Subscribe;

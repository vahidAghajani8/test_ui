import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/user/Login';
import Signup from './components/user/Signup';
import Home from './components/Home';
import ConfirmEmail from './components/user/ConfirmEmail';
import ResetPasswordRequest from './components/user/ResetPasswordRequest';
import ResetPassword from './components/user/ResetPassword';
import Subscribe from './components/payment/Subscribe';
import CancelPayment from './components/payment/CancelPayment';
import SuccessPayment from './components/payment/SuccessPayment';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Router>        
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/confirm/:token" element={<ConfirmEmail />} />
            <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
            <Route path="/cancel-payment" element={<ProtectedRoute><CancelPayment /></ProtectedRoute>} />
            <Route path="/success-payment" element={<SuccessPayment />} />
          </Routes>        
      </Router>
    </AuthProvider>
  );
}

export default App;

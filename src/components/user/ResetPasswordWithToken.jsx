import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPasswordWithToken() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== rePassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');

    try {
      const response = await fetch(`https://your-flask-app/api/reset/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, re_password: rePassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Reset failed');
      }

      setMessage(data.message);
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      console.error('Reset failed:', err);
      setError(err.message || 'Reset failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPasswordWithToken;

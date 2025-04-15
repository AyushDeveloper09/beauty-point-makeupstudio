import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/admin"); // Or wherever you want
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardContent>
          <Typography variant="h5" className="title">Login</Typography>
          <form onSubmit={handleLogin}>
            <TextField label="Email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" fullWidth required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
            <Button fullWidth onClick={() => navigate('/signup')}>Don't have an account? Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

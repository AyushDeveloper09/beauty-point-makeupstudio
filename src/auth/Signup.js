import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardContent>
          <Typography variant="h5" className="title">Sign Up</Typography>
          <form onSubmit={handleSignup}>
            <TextField label="Email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" fullWidth required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="contained" color="primary" fullWidth>Sign Up</Button>
            <Button fullWidth onClick={() => navigate('/login')}>Already have an account? Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;

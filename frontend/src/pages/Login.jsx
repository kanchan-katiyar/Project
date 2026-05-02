import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>TaskFlow Manager</h1>
          <p style={{ color: '#e0e7ff', fontSize: '1.25rem' }}>Organize your projects, track deadlines, and collaborate with your team efficiently.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="text-3xl text-center mb-2">Welcome Back</h2>
          <p className="text-center text-muted mb-8">Please enter your details to sign in.</p>
          {error && <div className="mb-4 text-center text-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn w-100" style={{ marginTop: '1rem' }}>Sign In</button>
          </form>
          <p className="text-center mt-6">
            Don't have an account? <Link to="/signup" style={{ fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

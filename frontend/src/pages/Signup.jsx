import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>TaskFlow Manager</h1>
          <p style={{ color: '#e0e7ff', fontSize: '1.25rem' }}>Join your team and start managing your tasks and projects with powerful features.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="text-3xl text-center mb-2">Create Account</h2>
          <p className="text-center text-muted mb-8">Sign up to get started as an Admin or Member.</p>
          {error && <div className="mb-4 text-center text-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Min. 6 characters"
              />
            </div>
            <button type="submit" className="btn w-100" style={{ marginTop: '1rem' }}>Sign Up</button>
          </form>
          <p className="text-center mt-6">
            Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

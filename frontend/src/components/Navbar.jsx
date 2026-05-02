import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="text-2xl" style={{ color: 'var(--accent-color)' }}>
        <Link to="/">TaskFlow Pro</Link>
      </div>
      <div className="nav-links">
        <span>Welcome, <strong>{user.name}</strong> ({user.role})</span>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

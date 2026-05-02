import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>ManagerPro</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={isActive('/')}>Dashboard</Link>
          </li>
          {/* We can add more links here like Settings, Profile, etc. */}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className={`user-role role-${user.role.toLowerCase()}`}>{user.role}</span>
        </div>
        <button onClick={handleLogout} className="btn-logout">Sign Out</button>
      </div>
    </aside>
  );
};

export default Sidebar;

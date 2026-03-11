import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="brand-mark">
          <span className="brand-badge">D</span>
          <div>
            <strong>DevLink</strong>
            <p>Portfolio showcase for developers</p>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Explore</NavLink>
          {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
          {isAuthenticated && <NavLink to="/projects/new">Add Project</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to={`/users/${user._id}`} className="ghost-button">
                {user.name}
              </Link>
              <button type="button" className="ghost-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="ghost-button">
                Login
              </Link>
              <Link to="/register" className="primary-button small-button">
                Join now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

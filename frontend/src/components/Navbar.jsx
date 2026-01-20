import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1 className="logo">GigFlow</h1>

      <div className="nav-right">
        {user ? (
          <>
            <span className="username">{user.name}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <span className="guest">Not logged in</span>
        )}
      </div>
    </nav>
  );
}

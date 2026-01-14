import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user, login, register, logout } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="app">
      <div className="card">
        {user ? (
          <>
            <h2>Welcome, {user.name}</h2>
            <p>You are logged in</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <h2>{isRegister ? "Register" : "Login"}</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {isRegister && (
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSubmit}>
              {isRegister ? "Create Account" : "Login"}
            </button>

            <button
              className="secondary"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister
                ? "Already have an account? Login"
                : "New here? Register"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

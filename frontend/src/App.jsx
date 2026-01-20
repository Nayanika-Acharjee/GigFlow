import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import "./App.css";

export default function App() {
  const { user, login, register, logout } = useAuth();

  const [page, setPage] = useState("login");
  const [authMode, setAuthMode] = useState("login");

  // auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // app data
  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);

  /* ---------------- AUTH ---------------- */

  const handleLogin = async () => {
    try {
      await login(email, password);
      setPage("home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      if (password !== confirm) {
        alert("Passwords do not match");
        return;
      }
      const name = email.split("@")[0];
      await register(name, email, password);
      setPage("home");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  if (!user) {
    return (
      <div className="auth-center">
        <div className="auth-card">
          <h2>{authMode === "login" ? "Login" : "Register"}</h2>

          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

          {authMode === "register" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          )}

          <button onClick={authMode === "login" ? handleLogin : handleRegister}>
            {authMode === "login" ? "Login" : "Register"}
          </button>

          <button className="link" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
            {authMode === "login" ? "New user? Register" : "Already have an account?"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- ACTIONS ---------------- */

  const createGig = (title, desc, budget) => {
    setGigs([
      {
        id: Date.now(),
        title,
        desc,
        budget,
        hiredBidId: null,
        ownerId: user._id,     // ✅ OWNER STORED
        ownerEmail: user.email
      },
      ...gigs
    ]);
  };

  const placeBid = (gigId, message, amount) => {
    const gig = gigs.find(g => g.id === gigId);

    if (gig.ownerId === user._id) {
      alert("You can't place a bid on your own gig");
      return;
    }

    setBids([
      {
        id: Date.now(),
        gigId,
        message,
        amount,
        status: "pending",
        bidderId: user._id    // ✅ BIDDER STORED
      },
      ...bids
    ]);

    alert("Bid placed successfully");
  };

  const hireBid = (bidId, gigId) => {
    const bid = bids.find(b => b.id === bidId);
    const gig = gigs.find(g => g.id === gigId);

    // ❌ bidder cannot hire himself
    if (bid.bidderId === user._id) {
      alert("You cannot hire yourself");
      return;
    }

    // ❌ only gig owner can hire
    if (gig.ownerId !== user._id) {
      alert("Only the gig creator can hire");
      return;
    }

    setBids(
      bids.map(b =>
        b.gigId === gigId
          ? { ...b, status: b.id === bidId ? "hired" : "rejected" }
          : b
      )
    );

    setGigs(
      gigs.map(g =>
        g.id === gigId ? { ...g, hiredBidId: bidId } : g
      )
    );

    alert("🎉 Congratulations! Freelancer hired successfully");
  };

  const openGigs = gigs.filter(g => !g.hiredBidId);
  const myBids = bids;

  /* ---------------- UI ---------------- */

  return (
    <div className="app-layout">
      <div className="dashboard">
        <h2>GigFlow Dashboard</h2>
        <span>Welcome</span>
      </div>

      <div className="sidebar">
        <h3>MENU</h3>
        <a onClick={() => setPage("home")}>🏠HOME</a>
        <a onClick={() => setPage("profile")}>👤PROFILE</a>
        <a onClick={() => setPage("view-bids")}>📌VIEW BIDS</a>
        <a onClick={() => setPage("status")}>📊STATUS</a>
        <a onClick={() => setPage("contact")}>☎️CONTACT</a>
        <button className="logout" onClick={logout}>⚙️Logout</button>
      </div>

      <div className="main">
        {page === "home" && (
          <div className="home-layout">
            <div className="page large">
              <h2 className="text">CREATE GIGS</h2>
              <input id="title" placeholder="Title" />
              <input id="desc" placeholder="Description" />
              <input id="budget" placeholder="Budget" />

              <button onClick={() =>
                createGig(
                  document.getElementById("title").value,
                  document.getElementById("desc").value,
                  document.getElementById("budget").value
                )
              }>
                Create Gig
              </button>
            </div>

            <div className="right">
              <h3>OPEN GIGS</h3>
              {openGigs.map(gig => (
                <div className="gig-card" key={gig.id}>
                  <h4>{gig.title}</h4>
                  <p>{gig.desc}</p>
                  <strong>₹ {gig.budget}</strong>

                  <input id={`msg-${gig.id}`} placeholder="Bid message" />
                  <input id={`amt-${gig.id}`} placeholder="Bid amount" />

                  <button onClick={() =>
                    placeBid(
                      gig.id,
                      document.getElementById(`msg-${gig.id}`).value,
                      document.getElementById(`amt-${gig.id}`).value
                    )
                  }>
                    Place Bid
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "view-bids" && (
          <div className="page">
            <h2>Your Bids</h2>
            {myBids.map(b => (
              <div key={b.id} className={`bid-card ${b.status}`}>
                <p>{b.message}</p>
                <strong>₹ {b.amount}</strong>

                {b.status === "hired" && (
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    🎉 Congratulations! You got hired!
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {page === "status" && (
          <div className="page">
            <h2>Status</h2>
            {myBids.map(b => {
              const gig = gigs.find(g => g.id === b.gigId);
              const isCreator = gig?.ownerId === user._id;

              return (
                <div key={b.id} className={`bid-card ${b.status}`}>
                  <span className={`status-pill ${b.status}`}>
                    {b.status.toUpperCase()}
                  </span>

                  {isCreator && b.status === "pending" && (
                    <button onClick={() => hireBid(b.id, b.gigId)}>
                      Hire
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {page === "profile" && (
          <div className="page">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}

        {page === "contact" && (
          <div className="page">
            <h2>Contact Us</h2>
            <input id="contact-subject" placeholder="Subject" />
            <textarea id="contact-message" rows="5" placeholder="Your message" />
            <button onClick={() => alert("📩 Message sent successfully!")}>
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

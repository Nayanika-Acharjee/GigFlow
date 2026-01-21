import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import api from "./axios";
import "./App.css";

export default function App() {
  const { user, login, register, logout } = useAuth();

  const [page, setPage] = useState("login");
  const [authMode, setAuthMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);

  /* ---------------- LOAD GIGS ---------------- */
  useEffect(() => {
    if (!user) return;

    api.get("/gigs").then(res => {
      const normalized = res.data.map(g => ({
        ...g,
        id: g._id,
        desc: g.description,
        createdBy: g.ownerId
      }));
      setGigs(normalized);
    });
  }, [user]);

  /* ---------------- LOAD BIDS FOR GIG OWNER ---------------- */
useEffect(() => {
  if (!user || gigs.length === 0) return;

  const fetchBidsForOwnedGigs = async () => {
    try {
      const allBids = [];

      for (const gig of gigs) {
        // ✅ gig owner check (correct)
        if (gig.createdBy === user._id) {
          // ✅ send correct Mongo gig id
          const res = await api.get(`/bids/${gig.id}`);
          allBids.push(...res.data);
        }
      }

      setBids(allBids);
    } catch (err) {
      console.error("Failed to load bids for owner", err);
    }
  };

  fetchBidsForOwnedGigs();
}, [gigs, user]);

  /* ---------------- AUTH HANDLERS ---------------- */
  const handleLogin = async () => {
    await login(email, password);
    setPage("home");
  };

  const handleRegister = async () => {
    if (password !== confirm) return alert("Passwords do not match");
    const name = email.split("@")[0];
    await register(name, email, password);
    setPage("home");
  };

  if (!user) {
    return (
      <div className="auth-center">
        <div className="auth-card">
          <h2>{authMode === "login" ? "Login" : "Register"}</h2>
          <input value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {authMode === "register" && (
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          )}
          <button onClick={authMode === "login" ? handleLogin : handleRegister}>
            {authMode}
          </button>
          <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
            Switch
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- ACTIONS ---------------- */
  const createGig = async (title, desc, budget) => {
    const res = await api.post("/gigs", { title, description: desc, budget });
    setGigs(prev => [{ ...res.data, id: res.data._id, desc, createdBy: user._id }, ...prev]);
  };

const placeBid = async (gigId, message, amount) => {
  try {
    const gig = gigs.find(g => g.id === gigId);

    // ✅ correct ownership check
    if (gig.createdBy === user._id) {
      alert("You can't place a bid on your own gig");
      return;
    }

    // ✅ REAL backend call (this stores cookie + DB)
    const res = await api.post("/bids", {
      gigId,
      message,
      amount: Number(amount),
    });

    // ✅ update UI with backend response
    setBids(prev => [res.data, ...prev]);

    alert("✅ Bid placed successfully");
  } catch (err) {
    alert(err.response?.data?.message || "Failed to place bid");
  }
};

  /*-----------FILTERS--------------------*/
  const openGigs = gigs.filter(g => g.status !== "assigned");
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
              <input placeholder="Title" id="title" />
              <input placeholder="Description" id="desc" />
              <input placeholder="Budget" id="budget" />
              <button onClick={() =>
                createGig(
                  title.value,
                  desc.value,
                  budget.value
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

                  <input placeholder="Bid message" id={`msg-${gig.id}`} />
                  <input placeholder="Bid amount" id={`amt-${gig.id}`} />
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
             const isCreator = gig?.createdBy === user._id;


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

    <div className="profile-card">
      <p><strong>Name:</strong> {user.name || "User"}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  </div>
)}



       {page === "contact" && (
  <div className="page">
    <h2>Contact Us</h2>

    <input
      placeholder="Subject"
      id="contact-subject"
    />

    <textarea
      placeholder="Your message"
      rows="5"
      id="contact-message"
    />

    <button
      onClick={() => {
        const subject = document.getElementById("contact-subject").value;
        const message = document.getElementById("contact-message").value;

        if (!subject || !message) {
          alert("Please fill all fields");
          return;
        }

        alert("📩 Message sent successfully!");
        document.getElementById("contact-subject").value = "";
        document.getElementById("contact-message").value = "";
      }}
    >
      Send Message
    </button>
  </div>
)}



      </div>
    </div>
  );
}

 

import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import api from "./axios";
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


  useEffect(() => {
  if (!user) return;

  api.get("/gigs").then(res => setGigs(res.data));
  api.get("/bids/my").then(res => setBids(res.data));
}, [user]);



  /* ---------------- LOAD GIGS FROM BACKEND ---------------- */
useEffect(() => {
  if (user) {
    api.get("/gigs").then(res => {
      const normalized = res.data.map(g => ({
        ...g,
        id: g._id,                 
        desc: g.description,      
        createdBy: g.ownerId       
      }));
      setGigs(normalized);
    });
  }
}, [user]);

useEffect(() => {
  if (!user) return;

  // fetch all bids for gigs owned by user
  const fetchBids = async () => {
    try {
      const allBids = [];

      for (const gig of gigs) {
        if (gig.ownerId === user._id) {
          const res = await api.get(`/bids/${gig._id}`);
          allBids.push(...res.data);
        }
      }

      setBids(allBids);
    } catch (err) {
      console.error("Failed to load bids");
    }
  };

  fetchBids();
}, [gigs, user]);



  
  /* ---------------- AUTH HANDLERS ---------------- */

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

  /* ---------------- ACTIONS ---------------- */

  const createGig = async (title, desc, budget) => {
  try {
    const res = await api.post("/gigs", {
      title,
      description: desc,
      budget: Number(budget),
    });

    setGigs(prev => [res.data, ...prev]);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to create gig");
  }
};

  
/* ---------------- BID LOGIC ---------------- */

const placeBid = async (gigId, message, amount) => {
  try {
    await api.post("/bids", {
      gigId,
      message,
      price: amount,
    });

    alert("Bid placed successfully");

    // refresh bids
    const res = await api.get(`/bids/${gigId}`);
    setBids(prev => [...prev, ...res.data]);

  } catch (err) {
    alert(err.response?.data?.message || "Failed to place bid");
  }
};

const hireBid = async (bidId, gigId) => {
  try {
    await api.post(`/bids/${bidId}/hire`);

    alert("🎉 Freelancer hired successfully");

    // refresh gigs + bids
    const gigsRes = await api.get("/gigs");
    setGigs(gigsRes.data);

    const bidsRes = await api.get(`/bids/${gigId}`);
    setBids(bidsRes.data);

  } catch (err) {
    alert(err.response?.data?.message || "Hire failed");
  }
};

/* ---------------- FILTERS ---------------- */

const openGigs = gigs.filter(g => g.status === "open");
const myBids = bids;


  /* ---------------- AUTH UI ---------------- */

  if (!user) {
    return (
      <div className="auth-center">
        <div className="auth-card">
          <h2>{authMode === "login" ? "Login" : "Register"}</h2>

          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

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
                <div className="gig-card" key={gig._id}>
                  <h4>{gig.title}</h4>
                  <p>{gig.description}</p>
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
      const gig = gigs.find(g => g._id === b.gigId);
      const isCreator = gig?.ownerId === user._id;

      return (
        <div key={b._id} className={`bid-card ${b.status}`}>
          <span className={`status-pill ${b.status}`}>
            {b.status.toUpperCase()}
          </span>

          {isCreator && b.status === "pending" && (
            <button onClick={() => hireBid(b._id, b.gigId)}>
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

  


import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    api.get("/gigs").then(res => setGigs(res.data));
  }, []);

  return (
    <div>
      <h2>Gigs</h2>
      {gigs.map(g => (
        <div key={g._id}>
          <Link to={`/gigs/${g._id}`}>{g.title}</Link>
        </div>
      ))}
    </div>
  );
}


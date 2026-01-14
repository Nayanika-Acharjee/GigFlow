import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function GigDetails() {
  const { id } = useParams();
  const [bids, setBids] = useState([]);

  useEffect(() => {
    api.get(`/bids/${id}`).then(res => setBids(res.data));
  }, []);

  const hire = async (bidId) => {
    await api.post(`/bids/${bidId}/hire`);
    alert("Hired!");
  };

  return (
    <div>
      <h3>Bids</h3>
      {bids.map(b => (
        <div key={b._id}>
          {b.message} - ${b.price}
          {b.status === "pending" && (
            <button onClick={() => hire(b._id)}>Hire</button>
          )}
        </div>
      ))}
    </div>
  );
}

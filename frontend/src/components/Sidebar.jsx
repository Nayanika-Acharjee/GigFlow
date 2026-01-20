import "./Sidebar.css";

export default function Sidebar({ active, setActive }) {
  const items = ["home", "profile", "view-bids", "status", "contact"];

  return (
    <div className="sidebar">
      <h2 className="logo">GigFlow</h2>

      {items.map((item) => (
        <button
          key={item}
          className={active === item ? "active" : ""}
          onClick={() => setActive(item)}
        >
          {item.replace("-", " ").toUpperCase()}
        </button>
      ))}
    </div>
  );
}

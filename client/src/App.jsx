import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState("Checking server...");

  useEffect(() => {
    // Call our backend
    fetch("http://localhost:5000/api/health")
      .then((res) => res.json())
      .then((data) => {
        setHealth(`${data.status} - ${data.message}`);
      })
      .catch((err) => {
        console.error(err);
        setHealth("Error: Cannot reach server");
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", flexDirection: "column", gap: "1rem" }}>
      <h1>Project Manager App (MERN)</h1>
      <p>Backend health: {health}</p>
      <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
        If you see "ok - Server is running", frontend ↔ backend connection works!
      </p>
    </div>
  );
}

export default App;

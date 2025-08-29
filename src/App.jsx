import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Home from "./pages/Home.jsx";
import Artifact1 from "./pages/Artifact1.jsx";
import Artifact2 from "./pages/Artifact2.jsx";
import Artifact3 from "./pages/Artifact3.jsx";
import Artifact4 from "./pages/Artifact4.jsx";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://192.168.33.100:80/ws";

function ArtifactRouteWrapper() {
  const { id } = useParams();
  switch (id) {
    case "1": return <Artifact1 />;
    case "2": return <Artifact2 />;
    case "3": return <Artifact3 />;
    case "4": return <Artifact4 />;
    default:  return <Home />;
  }
}

export default function App() {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const pingTimerRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          pingTimerRef.current = setInterval(() => {
            try { ws.readyState === 1 && ws.send("PING"); } catch {}
          }, 60000);
        };

        ws.onmessage = async (e) => {
          const raw = typeof e.data === "string"
            ? e.data
            : (e.data instanceof Blob ? await e.data.text() : String(e.data));
          const msg = raw.trim().toUpperCase();
          if (msg === "HOME") navigate("/");
        };

        ws.onerror = () => { try { ws.close(); } catch {} };

        ws.onclose = () => {
          setConnected(false);
          clearInterval(pingTimerRef.current);
          reconnectTimerRef.current = setTimeout(connect, 2000);
        };
      } catch {}
    };

    connect();

    return () => {
      clearTimeout(reconnectTimerRef.current);
      clearInterval(pingTimerRef.current);
      try { wsRef.current?.close(); } catch {}
    };
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artifact/:id" element={<ArtifactRouteWrapper />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {/* tiny WS status dot (green = connected, red = disconnected) */}
      <div
        aria-label={connected ? "WebSocket connected" : "WebSocket disconnected"}
        title={connected ? "Connected" : "Disconnected"}
        style={{
          position: "fixed",
          right: 12,
          bottom: 12,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: connected ? "#2ecc71" : "#e74c3c",
          boxShadow: "0 0 10px rgba(0,0,0,.35)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
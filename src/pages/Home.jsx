import { useNavigate } from "react-router-dom"; 
import a1 from "../assets/img/artifact1.png";
import a2 from "../assets/img/artifact2.png";
import a3 from "../assets/img/artifact3.png";
import a4 from "../assets/img/artifact4.png";

const ARTIFACTS = [
  { id: 1, title: "קערת השבעה", img: a1, bg: "#FF6A45" },
  { id: 2, title: "כתב יתדות",  img: a2, bg: "#4E79FF" },
  { id: 3, title: "חרפושית",    img: a3, bg: "#FFC247" },
  { id: 4, title: "שבר מצבה",   img: a4, bg: "#18C06A" },
];

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="quarters">
      {ARTIFACTS.map((a) => (
        <button
          key={a.id}
          className="qbtn"
          onClick={() => nav(`/artifact/${a.id}`)}
          aria-label={a.title}
        >
          <div className="qbtn-media" style={{ background: a.bg }}>
            <img src={a.img} alt={a.title} />
            <div className="caption-bottom" dir="rtl">
              {a.title}
            </div>
          </div>
        </button>
      ))}

      {/* Overlay center button (decorative, not clickable) */}
      <div className="center-wrapper">
        <button className="center-pulse-btn" aria-label="תבחר תמונה" tabIndex={-1}>
          תבחר תמונה
        </button>
      </div>
    </div>
  );
}

// src/pages/Artifact1.jsx
import ArtifactTemplate from "./_ArtifactTemplate.jsx";
import v1 from "../assets/videos/Artifact1.mp4"; // ✅ import from src

export default function Artifact1() {
  return (
    <ArtifactTemplate
      title="קערת השבעה"
      src={v1} // ✅ use the imported URL
      poster="/img/artifact1.png" // if this lives in public/img
      modelUrl="/models/bowl_textured.ply" 
    />
  );
}

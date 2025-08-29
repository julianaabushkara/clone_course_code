import ArtifactTemplate from "./_ArtifactTemplate.jsx";
import v1 from "../assets/videos/Artifact1.mp4"; // ✅ import from src

export default function Artifact4() {
  return (
    <ArtifactTemplate
      title="כרטושים"
      src={v1} // ✅ use the imported URL
      poster="/img/artifact4.png" // if this lives in public/img
      modelUrl="/models/cart.ply"
    />
  );
}

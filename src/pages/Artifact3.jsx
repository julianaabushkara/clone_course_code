// src/pages/Artifact3.jsx
import ArtifactTemplate from "./_ArtifactTemplate.jsx";
import v1 from "../assets/videos/Artifact3.mp4";

export default function Artifact3() {
  return (
    <ArtifactTemplate
      title="חרפושית"
      src={v1}
      poster="/img/artifact3.png"
      modelUrl="/models/Harpushit.ply"        // 👈 STL shown after video ends
    />
  );
}

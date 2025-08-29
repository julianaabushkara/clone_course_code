// src/components/AnyMeshViewer.jsx
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Bounds, Environment, OrbitControls, Html } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { STLLoader, PLYLoader } from "three-stdlib";

function MeshFromFile({ url, color = "#9aa7b4" }) {
  const ext = url.split(".").pop().toLowerCase();

  // טוען STL או PLY
  const geometryRaw = useLoader(ext === "stl" ? STLLoader : PLYLoader, url);
  const meshRef = useRef();

  // ממיר ל-BufferGeometry, מנקה ומחליק נורמלים, מרכז ומקבע סקייל סביר
  const geometry = useMemo(() => {
    const g = geometryRaw.isBufferGeometry
      ? geometryRaw
      : new THREE.BufferGeometry().fromGeometry(geometryRaw);

    // לעיתים ב-PLY אין נורמלים
    g.computeVertexNormals();

    // מרכז את המודל סביב (0,0,0)
    g.computeBoundingBox();
    const box = g.boundingBox;
    const center = new THREE.Vector3();
    box.getCenter(center);
    g.translate(-center.x, -center.y, -center.z);

    // סקייל עדין: אם המודל עצום/קטן – נביא אותו לטווח נוח
    g.computeBoundingSphere();
    const r = g.boundingSphere?.radius || 1;
    const target = 1; // רדיוס נורמלי לסצנה
    const s = target / r;
    g.scale(s, s, s);

    return g;
  }, [geometryRaw]);

  // סיבוב עדין כשלא נוגעים
  useFrame((_, d) => {
    if (meshRef.current) meshRef.current.rotation.y += d * 0.25;
  });

  const hasColors = !!geometry.getAttribute("color");
  const material = useMemo(
    () =>
      hasColors
        ? new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.7,
            metalness: 0.1,
          })
        : new THREE.MeshStandardMaterial({
            color,
            roughness: 0.6,
            metalness: 0.2,
          }),
    [hasColors, color]
  );

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function AnyMeshViewer({ url }) {
  return (
    <div
      className="model-stage"
      style={{ width: "100vw", height: "100dvh", background: "#000" }}
    >
      <Canvas camera={{ position: [0, 0.8, 2.6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight intensity={1} position={[3, 4, 5]} />

        <Suspense
          fallback={
            <Html center>
              <div
                style={{
                  background: "rgba(0,0,0,.55)",
                  color: "white",
                  padding: "10px 14px",
                  borderRadius: 12,
                  fontSize: 16,
                }}
              >
                טוען מודל תלת־ממד…
              </div>
            </Html>
          }
        >
          {/* Bounds רק מסדר פריימינג במצלמה – לא מגביל את הקאנבס */}
          <Bounds fit clip observe margin={1.05}>
            <MeshFromFile url={url} />
          </Bounds>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.9}
          zoomSpeed={0.9}
          panSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}

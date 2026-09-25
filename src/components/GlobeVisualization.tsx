import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Region, StatusLevel } from "../types/cloud";

interface GlobeVisualizationProps {
  regions: Region[];
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string | null) => void;
  isDark: boolean;
}

const STATUS_COLORS: Record<StatusLevel, string> = {
  ok: "#34D399",
  warning: "#FBBF24",
  error: "#FB7185",
};

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function generateEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0b2b46");
  gradient.addColorStop(0.5, "#1f6f9b");
  gradient.addColorStop(1, "#0b1e2d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1ea575";
  const continents = [
    [ [80, 120], [140, 90], [210, 120], [250, 140], [220, 210], [120, 210], [80, 170] ],
    [ [420, 120], [520, 90], [610, 120], [670, 170], [620, 220], [480, 210], [430, 170] ],
    [ [720, 140], [770, 100], [840, 110], [900, 170], [850, 210], [760, 220], [710, 180] ],
    [ [300, 260], [390, 250], [440, 300], [410, 355], [330, 340], [270, 300] ],
    [ [520, 300], [590, 280], [690, 310], [670, 360], [560, 380], [500, 350] ],
  ];

  continents.forEach((continent) => {
    ctx.beginPath();
    continent.forEach(([x, y], index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
  });

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  for (let i = 0; i < 200; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function GlobeScene({
  regions,
  selectedRegionId,
  onSelectRegion,
  isDark,
}: GlobeVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const targetMarker = useRef<THREE.Vector3 | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const earthTexture = useMemo(() => generateEarthTexture(), []);

  useFrame(({ clock, camera }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }

    if (targetMarker.current) {
      camera.position.lerp(targetMarker.current, 0.07);
      camera.lookAt(cameraTarget.current);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 0, 5.5), 0.05);
      camera.lookAt(0, 0, 0);
    }
  });

  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? null;
  const selectedVector = selectedRegion
    ? latLngToVector3(selectedRegion.lat, selectedRegion.lng, 1.75)
    : null;

  const markerData = regions.map((region) => {
    const pos = latLngToVector3(region.lat, region.lng, 1.7);
    const isSelected = region.id === selectedRegionId;
    const isHovered = region.id === hoveredRegionId;
    const scale = isSelected ? 1.6 : isHovered ? 1.35 : 1;
    return {
      ...region,
      pos,
      scale,
      isSelected,
      isHovered,
    };
  });

  return (
    <>
      <color attach="background" args={[isDark ? "#020915" : "#eaf4ff"]} />
      <ambientLight intensity={isDark ? 0.9 : 1.1} color={isDark ? "#b7d8ff" : "#ffffff"} />
      <directionalLight
        position={[3, 2, 4]}
        intensity={isDark ? 1.5 : 1.15}
        color={isDark ? "#d9f2ff" : "#fff6d8"}
      />
      <Stars radius={50} depth={25} count={isDark ? 1800 : 800} factor={4} saturation={0} fade speed={0.6} />

      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[1.7, 32, 32]} />
          <meshStandardMaterial
            map={earthTexture}
            emissive={isDark ? "#0d2b49" : "#1b3f62"}
            emissiveIntensity={isDark ? 0.35 : 0.2}
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>

        {markerData.map((region) => {
          const statusColor = STATUS_COLORS[region.status];
          const isSelected = region.id === selectedRegionId;
          const isHovered = region.id === hoveredRegionId;
          const size = isSelected ? 0.084 : isHovered ? 0.07 : 0.055;

          return (
            <group key={region.id} position={region.pos}>
              <mesh
                onPointerOver={(event) => {
                  event.stopPropagation();
                  setHoveredRegionId(region.id);
                }}
                onPointerOut={() => setHoveredRegionId(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectRegion(region.id);
                  targetMarker.current = region.pos.clone().multiplyScalar(3.2);
                }}
              >
                <sphereGeometry args={[size, 16, 16]} />
                <meshStandardMaterial
                  color={statusColor}
                  emissive={statusColor}
                  emissiveIntensity={isSelected ? 2.1 : 1.3}
                  toneMapped={false}
                />
              </mesh>

              {isSelected && (
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[size * 1.8, 18, 18]} />
                  <meshBasicMaterial color={statusColor} transparent opacity={0.12} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {selectedRegion && selectedVector && (
        <Html position={selectedVector.clone().multiplyScalar(1.9)} center distanceFactor={7}>
          <div className="rounded-xl border border-border bg-card/90 px-3 py-2 shadow-xl backdrop-blur-sm dark:shadow-hud">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                  Región
                </p>
                <h3 className="text-[14px] font-semibold text-text-primary">
                  {selectedRegion.region}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelectRegion(null)}
                className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium text-text-secondary"
              >
                Volver
              </button>
            </div>

            <p className="text-[12px] text-text-secondary">{selectedRegion.location}</p>
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {selectedRegion.deployedServices.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                >
                  {service}
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-text-secondary">
              <span>Estado</span>
              <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: STATUS_COLORS[selectedRegion.status] }}>
                {selectedRegion.status}
              </span>
            </div>
          </div>
        </Html>
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  );
}

export default function GlobeVisualization({
  regions,
  selectedRegionId,
  onSelectRegion,
  isDark,
}: GlobeVisualizationProps) {
  return (
    <div className="relative h-[500px] overflow-hidden rounded-xl border border-border bg-background/30">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 38 }}>
        <Suspense fallback={null}>
          <GlobeScene
            regions={regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={onSelectRegion}
            isDark={isDark}
          />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-border bg-card/80 px-2 py-1 text-[11px] font-medium text-text-secondary backdrop-blur-sm">
        Vista global
      </div>
    </div>
  );
}

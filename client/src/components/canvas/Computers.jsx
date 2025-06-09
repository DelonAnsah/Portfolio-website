import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../CanvasLoader";

const Computers = ({ deviceType}) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  let scale, position;

if (deviceType === "mobile") {
  scale = 0.37;
  position = [6, -2.3, 0.8];
} else if (deviceType === "tablet") {
  scale = 0.46;
  position = [4, -3, 0.3];
} else if (deviceType === "laptop") {
  scale = 0.68;
  position = [-1, -3.7, -1.1];
} else if (deviceType === "lg-desktop") {
  scale = 0.72; 
  position = [0, -3.3, 0];
} else if (deviceType === "desktop") {
  scale = 0.7;
  position = [0, -2.8, -0.8];
} else if (deviceType === "xl-desktop") {
  scale = 0.78;
  position = [0, -2.9, -1.4];
}


  return (
    <mesh>
      <primitive
        object={computer.scene}
        scale={scale}
        position={position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [deviceType, setDeviceType] = useState("desktop");


useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;

    if (width <= 500) {
      setDeviceType("mobile");
    } else if (width <= 768) {
      setDeviceType("tablet");
    } else if (width <= 1024) {
      setDeviceType("laptop");
    } else if (width <= 1280) {
      setDeviceType("lg-desktop");
    } else if (width <= 1536) {
      setDeviceType("desktop");
    } else {
      setDeviceType("xl-desktop");
    }
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);


  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.7} />
        <directionalLight
          position={[0, 10, 5]}
          intensity={3.0}
          castShadow
        />

        <hemisphereLight
          skyColor={0xaaaaaa}
          groundColor={0x444444}
          intensity={0.4}
        />

        <spotLight
          position={[0, 5, 10]}
          angle={Math.PI / 4}
          intensity={1.2}
          castShadow
        />

        <pointLight
          position={[-5, 2, -5]}
          intensity={0.6}
        />

        <Computers deviceType={deviceType} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;

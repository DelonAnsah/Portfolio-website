import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from '../CanvasLoader';

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);


  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

class ErrorBoundary extends React.Component {
  state = { hasError: false, contextLost: false };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      contextLost: error.message.includes('CONTEXT_LOST')
    };
  }

  componentDidCatch(error, info) {
    console.error('WebGL Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#050816',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          borderRadius: '50%' // Added to match ball shape
        }}>
          {this.state.contextLost ? (
            <div style={{ textAlign: 'center' }}>
              <p>Graphics context lost.</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  background: '#fff',
                  color: '#050816',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Refresh
              </button>
            </div>
          ) : (
            <p>3D rendering failed.</p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}


const BallCanvas = ({ icon }) => {


  return (
    <ErrorBoundary>
      <Canvas
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} />
        </Suspense>

        <Preload all />
      </Canvas>
    </ErrorBoundary>

  );
};

export default BallCanvas;
import React, { useRef, useState, Suspense } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';  // 혹은 필요한 THREE 모듈만 선택적으로 가져올 수도 있습니다.


extend({ OrbitControls });

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 5.5 }));

  useFrame((state, delta) => {
    const mouseX = (state.mouse.x * state.viewport.width) / 2;
    const mouseY = (state.mouse.y * state.viewport.height) / 2;

    ref.current.rotation.x = (mouseY - ref.current.position.y) * 0.005;
    ref.current.rotation.y = (mouseX - ref.current.position.x) * 0.005;

    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
      <Points positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#6ce48e" size={0.02} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
};



const Model = () => {
  const modelRef = useRef();

  useFrame((state) => {
    const mouseX = (state.mouse.x * state.viewport.width) / 2;
    const mouseY = (state.mouse.y * state.viewport.height) / 2;

    // 모델의 위치를 정확히 마우스 위치로 설정
    modelRef.current.position.x = mouseX;
    modelRef.current.position.y = mouseY;
  });
  useFrame(() => {
    modelRef.current.rotation.y += 0.01;
    modelRef.current.rotation.x += 0.022;
    modelRef.current.rotation.z += 0.02;
  });

  const gltf = useGLTF('/spaceship.glb');

  return <primitive ref={modelRef} scale={0.1} object={gltf.scene} />;
};

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <Environment preset='sunset'/>
        <Stars />
        <Model />
      </Suspense>
    </Canvas>
  );
}

export default App;

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, useProgress, Float, Environment, Center, ContactShadows } from '@react-three/drei';
import { Model as LafilogoModel } from './Lafilogo';

// Componente simples para mostrar o progresso do carregamento
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-[#ff6d00] font-medium tracking-widest text-sm uppercase whitespace-nowrap">
        Carregando {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// Subcomponente para isolar a rotação do próprio modelo
function SpinningLogo() {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.35; 
    }
  });

  return (
    <Float 
      speed={2.5} 
      rotationIntensity={0.3} 
      floatIntensity={0.6} 
    >
      {/* Escala levemente ajustável não precisa ser hardcoded se o Canvas for responsivo */}
      <group ref={modelRef} scale={3.8} position={[0, 0, 0]}>
        <Center>
          <LafilogoModel />
        </Center>
      </group>
    </Float>
  );
}

const VisualizadorLafi: React.FC = () => {
  return (
    // Removido o pt-16 e pb-8 fixos que conflitavam com o flex-col do About.tsx
    <div className="w-full h-full relative flex items-center justify-center">

      {/* CARD DE DESTAQUE ATRÁS DO MODELO */}
      {/* CORREÇÃO CRÍTICA MOBILE: translate-y-0 no celular e lg:translate-y-24 no PC */}
      <div className="absolute z-[5] w-[85%] max-w-[380px] sm:max-w-[450px] aspect-square bg-[#ff6d00]/10 border border-[#ff6d00]/20 rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_0_80px_rgba(255,109,0,0.15)] flex items-center justify-center transition-all duration-700 hover:shadow-[0_0_120px_rgba(255,109,0,0.3)] hover:border-[#ff6d00]/40 group translate-y-0 lg:translate-y-24 overflow-hidden">
        
        {/* Glow inferior no card */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#ff6d00]/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
        {/* Círculo brilhante central */}
        <div className="absolute inset-0 m-auto w-2/3 h-2/3 bg-[#ff6d00]/10 blur-[60px] sm:blur-[80px] rounded-full group-hover:bg-[#ff6d00]/20 transition-colors duration-700" />
        
        {/* Canvas */}
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }} 
          className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing touch-none"
        >
          <Environment preset="city" />

          {/* Iluminação */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
          <directionalLight position={[-10, 0, -5]} intensity={1.5} color="#ff6d00" />
          <pointLight position={[0, -5, 0]} intensity={2} color="#ff6d00" />

          <Suspense fallback={<Loader />}>
            <SpinningLogo />
            {/* Sombras suaves de contato */}
            <ContactShadows 
              position={[0, -2.5, 0]} 
              opacity={0.6} 
              scale={10} 
              blur={2} 
              far={10} 
              color="#ff6d00" 
            />
          </Suspense>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={true} 
            autoRotate={false}
            maxPolarAngle={Math.PI / 2 + 0.3} 
            minPolarAngle={Math.PI / 2 - 0.3} 
          />
        </Canvas>
      </div>
    </div>
  );
};

export default VisualizadorLafi;
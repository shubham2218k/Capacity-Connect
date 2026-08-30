import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Instanced Sub-Nodes Component (3 draw calls for 36 nodes)
const InstancedSubNodes = ({ nodes, color }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    nodes.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, nodes.length]}>
      <sphereGeometry args={[0.09, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.65} />
    </instancedMesh>
  );
};

// Procedural Network Component
const NetworkNodes = ({ theme, pointerRef }) => {
  const rootGroupRef = useRef();
  const orbitGroupRef = useRef();
  const coreRef = useRef();
  const ringRef = useRef();

  const isDark = theme === 'dark';

  // Target palette based on theme
  const colors = useMemo(() => {
    return {
      core: new THREE.Color(isDark ? '#22D3EE' : '#0891B2'),
      admin: new THREE.Color(isDark ? '#0EA5E9' : '#2563EB'),
      trainer: new THREE.Color(isDark ? '#8B5CF6' : '#7C3AED'),
      trainee: new THREE.Color(isDark ? '#34D399' : '#059669'),
      line: new THREE.Color(isDark ? '#1E293B' : '#CBD5E1')
    };
  }, [isDark]);

  // Generate deterministic stable positions for 3 clusters + 36 sub-nodes
  const { clusters, groupedSubNodes, linePositions } = useMemo(() => {
    const clustersArr = [
      { id: 'admin', pos: new THREE.Vector3(-2.8, 1.6, 0), colorKey: 'admin' },
      { id: 'trainer', pos: new THREE.Vector3(3.4, 1.6, 0), colorKey: 'trainer' },
      { id: 'trainee', pos: new THREE.Vector3(0.5, -2.6, 0), colorKey: 'trainee' }
    ];

    const subNodesGrouped = {
      admin: [],
      trainer: [],
      trainee: []
    };

    const linesArr = [];
    const origin = new THREE.Vector3(0, 0, 0);

    // Lines from core (0,0,0) to cluster centers
    clustersArr.forEach(c => {
      linesArr.push(origin.x, origin.y, origin.z);
      linesArr.push(c.pos.x, c.pos.y, c.pos.z);
    });

    // Generate 12 deterministic sub-nodes per cluster
    clustersArr.forEach((c, clusterIdx) => {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + clusterIdx;
        const radius = 0.95 + (i % 3) * 0.35;
        const offsetZ = ((i % 4) - 2) * 0.2;

        const subPos = new THREE.Vector3(
          c.pos.x + Math.cos(angle) * radius,
          c.pos.y + Math.sin(angle) * radius,
          c.pos.z + offsetZ
        );

        subNodesGrouped[c.colorKey].push(subPos);

        // Line from cluster center to sub-node
        linesArr.push(c.pos.x, c.pos.y, c.pos.z);
        linesArr.push(subPos.x, subPos.y, subPos.z);
      }
    });

    return {
      clusters: clustersArr,
      groupedSubNodes: subNodesGrouped,
      linePositions: new Float32Array(linesArr)
    };
  }, []);

  // Frame Loop with Safe Delta & Strict Separation of Rotations
  useFrame((state, delta) => {
    // 1. Safe delta clamp to prevent huge rotation jumps after frameloop resume
    const safeDelta = Math.min(Math.max(delta, 0), 1 / 30);

    // 2. Autonomous Orbit Motion on Orbit Group (Wrapped between 0 and 2PI)
    if (orbitGroupRef.current) {
      const rotSpeed = Math.PI * 2 / 60; // 60 seconds per full revolution
      orbitGroupRef.current.rotation.y = (orbitGroupRef.current.rotation.y + safeDelta * rotSpeed) % (Math.PI * 2);
    }

    if (coreRef.current) {
      coreRef.current.rotation.z = (coreRef.current.rotation.z + safeDelta * 0.15) % (Math.PI * 2);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = (ringRef.current.rotation.x + safeDelta * 0.1) % (Math.PI * 2);
    }

    // 3. Bounded Pointer Parallax on Root Group using THREE.MathUtils.damp
    if (rootGroupRef.current) {
      const px = pointerRef?.current?.x || 0;
      const py = pointerRef?.current?.y || 0;

      // Strict rotation bounds (X: ±4 deg = 0.07 rad, Y: ±6 deg = 0.10 rad)
      const MAX_X = THREE.MathUtils.degToRad(4);
      const MAX_Y = THREE.MathUtils.degToRad(6);

      const targetX = THREE.MathUtils.clamp(-py * MAX_X, -MAX_X, MAX_X);
      const targetY = THREE.MathUtils.clamp(px * MAX_Y, -MAX_Y, MAX_Y);

      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, targetX, 4, safeDelta);
      rootGroupRef.current.rotation.y = THREE.MathUtils.damp(rootGroupRef.current.rotation.y, targetY, 4, safeDelta);
      rootGroupRef.current.rotation.z = THREE.MathUtils.damp(rootGroupRef.current.rotation.z, -px * 0.02, 4, safeDelta);
    }
  });

  return (
    // ROOT GROUP: Bounded Pointer Parallax
    <group ref={rootGroupRef} position={[0.8, 0, 0]}>
      
      {/* ORBIT GROUP: Autonomous Slow Revolutions */}
      <group ref={orbitGroupRef}>
        
        {/* CENTRAL CORE */}
        <mesh ref={coreRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshBasicMaterial color={colors.core} transparent opacity={0.8} />
        </mesh>

        {/* CORE ORBIT RING */}
        <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.3, 0.018, 16, 64]} />
          <meshBasicMaterial color={colors.core} transparent opacity={0.35} />
        </mesh>

        {/* CONNECTING LINES MESH */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={colors.line} transparent opacity={isDark ? 0.22 : 0.18} />
        </lineSegments>

        {/* 3 ROLE CLUSTERS */}
        {clusters.map((c) => (
          <mesh key={c.id} position={c.pos}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshBasicMaterial color={colors[c.colorKey]} transparent opacity={0.85} />
          </mesh>
        ))}

        {/* 36 SKILL SUB-NODES (INSTANCED) */}
        <InstancedSubNodes nodes={groupedSubNodes.admin} color={colors.admin} />
        <InstancedSubNodes nodes={groupedSubNodes.trainer} color={colors.trainer} />
        <InstancedSubNodes nodes={groupedSubNodes.trainee} color={colors.trainee} />

      </group>

    </group>
  );
};

const HeroScene = ({ theme, pointerRef, isFrameloopActive, onContextLost }) => {
  return (
    <div 
      className="lp-hero-scene-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: theme === 'dark' ? 0.85 : 0.65,
        transition: 'opacity 0.5s ease'
      }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={isFrameloopActive ? 'always' : 'never'}
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          if (!canvas) return;
          const handleContextLost = (e) => {
            e.preventDefault();
            if (onContextLost) onContextLost();
          };
          canvas.addEventListener('webglcontextlost', handleContextLost);
        }}
      >
        <NetworkNodes theme={theme} pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
};

export default HeroScene;

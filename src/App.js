import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { useGLTF, AccumulativeShadows, MeshRefractionMaterial, RandomizedLight, Html, Environment, Center, PresentationControls, OrbitControls, SpotLight, Sphere, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RGBELoader } from 'three-stdlib'
 import { Color } from 'three'
import { Stats } from '@react-three/drei'

function Ring({ map, position, ...props }) {



  const { nodes, materials } = useGLTF('/ring3.glb')

  return (<mesh position={position}>
    <group {...props} dispose={null}>

      {Object.keys(nodes).map(n => {
        const node = nodes[n];

        const material = node.material;
        if(material  && material.name==='metal') {

          material.color = new Color('#f7e2ad')

        }


        return <mesh
          castShadow={true}
          receiveShadow={true}
          key={n}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}

          geometry={node.geometry}
          material={node.material}
        >
          {n==='Diamond' && <MeshRefractionMaterial fastChroma={true} envMap={map} bounces={7} ior={8} aberrationStrength={0.04} fresnel={0.8} toneMapped={false} />}
          {n.includes('Diamond0') && <MeshRefractionMaterial fastChroma={true} envMap={map} bounces={3} ior={4} aberrationStrength={0.04} fresnel={0.8} toneMapped={false} />}

        </mesh>
      })}

    </group>
  </mesh>)

}


export default function App() {
  const texture = useLoader(RGBELoader, './environment_new_dark.hdr')
  texture.mapping = THREE.EquirectangularReflectionMapping


  return (
    <Canvas>
      <color attach="background" args={['#fff']} />
      <ambientLight intensity={5} />
      {/*<directionalLight         position={[0, 2, 2]}        intensity={1}      />*/}
      {/*<directionalLight         position={[0, 2, -2]}        intensity={1}      />*/}
      <Environment map={texture} />
      <OrbitControls
        autoRotate={true}
        enablePan={true}
        enableZoom={false}
        enableRotate={true}
        maxDistance={1.5}
      />

      <group position={[0, 0, 0]}>
        <Suspense fallback={null}>
          <Ring map={texture} scale={1} position={[0, 0, 0]} />


        </Suspense>

        <AccumulativeShadows    alphaTest={0.95} opacity={1} scale={20}>
          <RandomizedLight amount={8} radius={10} ambient={0.5} position={[0, 10, -2.5]} bias={0.001} size={3} />
        </AccumulativeShadows>

      </group>
      {/*<EffectComposer>*/}
      {/*  <Bloom luminanceThreshold={1} intensity={0.65}  luminanceSmoothing={0.05} height={300} />*/}
      {/*</EffectComposer>*/}

      {/*<EffectComposer>*/}
      {/*  <Bloom luminanceThreshold={1} intensity={0.95} levels={9} mipmapBlur />*/}
      {/*</EffectComposer>*/}

      <Stats />
    </Canvas>
  )
}

import * as THREE from 'three'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { useGLTF, AccumulativeShadows, MeshRefractionMaterial, RandomizedLight, Html, Environment, Center, PresentationControls, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RGBELoader } from 'three-stdlib'
import { HexColorPicker } from 'react-colorful'

function Ring({ map, position, ...props }) {

  const ringRef = useRef();




  const { nodes, materials } = useGLTF('/ring3.glb')
  const groupRef = useRef()

   return (<mesh position={position}><group {...props} dispose={null}>

    {Object.keys(nodes).map(n => {
      const node = nodes[n]
      return <mesh castShadow receiveShadow key={n}
                   position={node.position}
                   rotation={node.rotation}
                   scale={node.scale}
                   geometry={node.geometry} material={node.material}>
        {node.name.includes('Diamond') && <MeshRefractionMaterial envMap={map} aberrationStrength={0.02} toneMapped={false} />}
      </mesh>
    })}

  </group></mesh>)

}

export default function App() {
  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/peppermint_powerplant_2_1k.hdr')
  texture.mapping = THREE.EquirectangularReflectionMapping
  return (
    <Canvas shadows>
      <color attach="background" args={['#fff']} />
      <ambientLight intensity={4.5} />

      <directionalLight position={[0, 2, 0]} intensity={5} />


      <Environment map={texture} />
      <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} maxDistance={1.5}   />

      <group position={[0, 0, 0]}>
        <Suspense fallback={null}>
          <Ring map={texture} scale={1} position={[0,0,0]} />

        </Suspense>

          <RandomizedLight amount={8} radius={10} ambient={0.5} position={[0, 10, -2.5]} bias={0.001} size={3} />

      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={1} intensity={0.85} levels={9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}

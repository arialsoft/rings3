import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { useGLTF, AccumulativeShadows, MeshRefractionMaterial, RandomizedLight, Html, Environment, Center, PresentationControls, OrbitControls, SpotLight, Sphere, Sparkles, useCubeTexture } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RGBELoader } from 'three-stdlib'
 import { Color, ImageUtils, TextureLoader } from 'three'
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
          {n==='Diamond' && <MeshRefractionMaterial fastChroma={true} envMap={map} bounces={5} ior={5} aberrationStrength={0.04} fresnel={0.8} toneMapped={false} />}
          {n.includes('Diamond0') && <MeshRefractionMaterial fastChroma={true} envMap={map} bounces={3} ior={4} aberrationStrength={0.04} fresnel={0.8} toneMapped={false} />}

        </mesh>
      })}

    </group>
  </mesh>)

}


export default function App() {
  const texture = useLoader(RGBELoader, './environment_new_dark.hdr')
  const texture2 = useLoader(RGBELoader, './aerodynamics_workshop_1k.hdr')

  const texture3=  useLoader(TextureLoader, './environment/RoomA_py.jpg')
  texture.mapping = THREE.EquirectangularReflectionMapping
  const envMap = useCubeTexture(
    ['RoomA_px.jpg', 'RoomA_nx.jpg', 'RoomA_py.jpg', 'RoomA_ny.jpg', 'RoomA_pz.jpg', 'RoomA_nz.jpg'],
    { path: '/environment/' }
  )

  return (
    <Canvas  gl={{ antialias: false }} style={{height:'600px', width:'600px', margin:'auto auto'}} >
      <color attach="background" args={['#fff']} />
      <ambientLight intensity={3} />
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

           <RandomizedLight amount={4} radius={10} ambient={0.5} position={[0, 4, -2.5]} bias={0.01} size={3} />

      </group>
      {/*<EffectComposer>*/}
      {/*  <Bloom luminanceThreshold={1} intensity={0.65}  luminanceSmoothing={0.05} height={300} />*/}
      {/*</EffectComposer>*/}

      <EffectComposer>
        {/*<Bloom luminanceThreshold={1} intensity={0.85} levels={9} mipmapBlur />*/}
      </EffectComposer>

      <Stats />
    </Canvas>
  )
}

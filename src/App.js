//import all the things
import React, { Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useBounds, Bounds } from "@react-three/drei";
import * as THREE from "three";
import planetData from "./planetData";

import "./styles.css";


export default function App() {

  return (
    <>
      <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <SelectToZoom>
              <Sun />
              {/* Create all the plaents */}
              {planetData.map((planet) => (                
                <Planet planet={planet} key={planet.id} />
              ))}
            </SelectToZoom>
            </Bounds>
        </Suspense> 
        {/* Draw all the orbit lines */}
        {planetData.map((planet) => (          
          <Ecliptic key={planet.id} xRadius={planet.xRadius} zRadius={planet.zRadius} color={planet.color}/>          
        ))}
        <Lights />
        <OrbitControls makeDefault />        
      </Canvas>
    </>
  );
}



function Sun() {
  return (
    <mesh onClick={ () => {console.log("Sun was clicked")}}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshBasicMaterial color="#E1DC59" />
    </mesh>
  );
}


function Planet({ planet: { color, xRadius, zRadius, size, speed, offset, name, id, moons} }) {
  const planetRef = React.useRef();    
 
  const [xPostion, setXPostion] = useState(0)
  const [zPostion, setZPostion] = useState(0)


  //moves the plaent around its orbit
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (speed * 0) + offset;
    const x = xRadius * Math.sin(t);
    const z = zRadius * Math.cos(t);
    planetRef.current.position.x = x;
    planetRef.current.position.z = z;
    setXPostion(x)
    setZPostion(z)    
  }); 

  return (
    <>
      <mesh ref={planetRef} onClick={()=>{console.log(planetRef.current.position)}}>        
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
        <Html>
          <div className="annotation"> {name} </div>
        </Html>
      </mesh>
      <Moons moon={moons} planetRef={planetRef} xPostion={xPostion} zPostion={zPostion}/>
    </>
  );
}


function Moons({ moon: { moonColor, moonXRadius, moonZRadius, moonSize, moonSpeed, moonOffset, moonName, moonId}, xPostion, zPostion }) {    
  const moonRef = React.useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (moonSpeed * 0) + moonOffset;
    const x = (moonXRadius * Math.sin(t)) + xPostion;
    const z = (moonZRadius * Math.cos(t)) + zPostion;    
    moonRef.current.position.x = x;
    moonRef.current.position.z = z;
  }); 

    return(
      <>
        <mesh ref={moonRef}  onClick={()=>{console.log(moonRef.current.position)}}>
          <sphereGeometry args={[moonSize, 32, 32]} />
          <meshStandardMaterial color={moonColor} />
          <Html>
            <div className="annotation"> {moonName} </div>
          </Html>
        </mesh>
        <Ecliptic xRadius={moonXRadius} zRadius={moonZRadius} color={moonColor} xOffset={xPostion} zOffset={zPostion}/>
      </>
    )
}

function Lights() {
  return (
    <>      
      <pointLight position={[0, 0, 0]} intensity={3}/>
    </>
  );
}

//creates the line that shows the plaents' orbits by making a set of points and then connecting them
function Ecliptic({ xRadius, zRadius, color, xOffset, zOffset }) {
  //an array with all the points 
  const points = [];
  //sets the number of points you want in your orbit. The more points the more of a circle it looks like
  for (let index = 0; index < 64; index++) {
    // find the ange needed between each point based on the amount of points we have
    const angle = (index / 64) * 2 * Math.PI;
    // find the cordinates for each point
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    // adds the new point to the array of all the other points
    points.push(new THREE.Vector3(x, 0, z));
  }
  //adds the frist point to the end of the array so we draw the last line that goes from the last point back to the start point
  points.push(points[0]);
  //draws the line beteen each point
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  if (xOffset === undefined){
    return (
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color={color} linewidth={1} />
      </line>
    );
  }
  else{
    return (
      <line geometry={lineGeometry} position={[xOffset, 0, zOffset]}>
        <lineBasicMaterial attach="material" color={color} linewidth={1} />
      </line>
    );
  }
}

function SelectToZoom({ children }) {  
  const api = useBounds()
  return (
    <group 
      onClick={(e) => {                
        (e.delta <= 2 && api.refresh(e.object).fit())
        console.log(e.object.type)
      }}
      onPointerMissed={(e) => {
        e.button === 0 && api.refresh().fit()
      }}
      >
      {children}
    </group>
  )
}

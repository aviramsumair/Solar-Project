//import all the things
import React, { Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useBounds, Bounds } from "@react-three/drei";
import * as THREE from "three";
import TopBar from "./TopBar";
import planetData from "./planetData";
import "./styles.css";

//makes our baby
export default function App() {

  //states used to show/hide the planet and moon names 
  const [showPlanetNames, setShowPlanetNames] = useState(true)
  const [hideMoonNames, setHideMoonNames] = useState(false)



  return (
    <>
      <TopBar hideMoonNames={hideMoonNames} setHideMoonNames={setHideMoonNames} showPlanetNames={showPlanetNames} setShowPlanetNames={setShowPlanetNames}/>
      <Canvas camera={{ position: [0, 20, 25], fov: 55 }}>
        <Suspense fallback={null}>
          {/* set the zoom level when you click on a body*/}
          <Bounds
  ////      //the bounds settings are causing it to show the whole system when we click any button so need to look into that   
            //fit clip observe margin={1.8}
          >
          {/* wrap all the objects in here with the on click zoom effect */}
            <SelectToZoom>
              <Sun />
              {/* Create all the plaents */}
              {planetData.map((planet) => (                
                <Planet planet={planet} key={planet.id} showPlanetNames={showPlanetNames} hideMoonNames={hideMoonNames}/>
              ))}
            </SelectToZoom>
          </Bounds>
        </Suspense> 
        {/* Draw all the orbit lines outside of the bodies because we dont need to add any functionality on them*/}
        {planetData.map((planet) => (          
          <Ecliptic key={planet.id} xRadius={planet.xRadius} zRadius={planet.zRadius} color={planet.color}/>          
        ))}
        <Lights />
        <OrbitControls makeDefault />        
      </Canvas>
    </>
  );
}

//creats the lights for the scene 
function Lights() {
  return (
    <>      
      <pointLight position={[0, 0, 0]} intensity={3}/>
    </>
  );
}

//Make the Sun 
function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[8, 32, 32]} />
      {/* we use basic material so we dont have to light it with global illumniation */}
      <meshBasicMaterial color="#E1DC59" />
    </mesh>
  );
}



//creates the planet based on the given info and passes in the planet's moon array 
function Planet({ planet: { color, xRadius, zRadius, size, speed, offset, name, id, moons}, showPlanetNames, hideMoonNames}) {
  //create a reference to the mesh using React’s useRef hook
  const planetRef = React.useRef();    
  //create a state to hold the planets X and Z positions to pass to the moons to calculate thier offsets
  const [planetXPostion, setPlanetXPostion] = useState(0)
  const [planetZPostion, setPlanetZPostion] = useState(0)

  //moves the plaent around its orbit
  //useFrame updates the planets postion every frame. We use clock as it refences the internal system clock
  useFrame(({ clock }) => {
    //get the time differnece between each frame then add the speed speed of the planet to figure out how much we should 
    //move the planet since the last frame was called
    const t = clock.getElapsedTime() * (speed * 0) + offset;
    //gets the new X and Z postion based on the change in time and its speed 
    const x = xRadius * Math.sin(t);
    const z = zRadius * Math.cos(t);
    //updates the planets postion on the screen and then updates the planet's X and Z states with its new position
    planetRef.current.position.x = x;
    planetRef.current.position.z = z;
    setPlanetXPostion(x)
    setPlanetZPostion(z)    
  }); 

  //decides what class we should use for the name of the div that we use for the name to show or hide it
  const planetAnnotationClass = showPlanetNames ? "planetAnnotation" : "annotationHide"

  return (
    <>
      <mesh ref={planetRef}>  
        {/* create the planet based on the info that it is given from the planet array */}
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
        {/* adds the HTML element that holds the name of the body */}
        <Html>
          <div className={planetAnnotationClass}> {name} </div>
        </Html>
      </mesh>
      {/* maps over the planet's moon arary and adds the moon to the planet and then pass it it's planet's position */}
      {moons.map((moon) => (              
        <Moons key={moon.id} moon={moon} planetRef={planetRef} planetXPostion={planetXPostion} planetZPostion={planetZPostion} hideMoonNames={hideMoonNames}/>
      ))}
    </>
  );
}




//creates the moon and it's orbit line from the given info about that moon 
function Moons({ moon: { moonColor, moonXRadius, moonZRadius, moonSize, moonSpeed, moonOffset, moonName, moonId}, planetXPostion, planetZPostion, hideMoonNames}) {    
  //create a reference to the mesh using React’s useRef hook
  const moonRef = React.useRef()
  //moves the moon in the same way we move the plaents
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (moonSpeed * 0) + moonOffset;
    //we add in the planet's location so we can use it to offset the moons rotation to rotate around
    //the planet's center and not the Sun's center
    moonRef.current.position.x = (moonXRadius * Math.sin(t)) + planetXPostion;
    moonRef.current.position.z = (moonZRadius * Math.cos(t)) + planetZPostion; 
  }); 

  //decides what class we should use for the name of the div that we use for the name to show or hide it
  const moonAnnotationClass = hideMoonNames ? "annotationHide" : "moonAnnotation"

  return(
    <>
      <mesh ref={moonRef}>
        {/* builds the moon based on the info that it recives */}
        <sphereGeometry args={[moonSize, 32, 32]} />
        <meshStandardMaterial color={moonColor} />
        {/* adds the name tag to the moon */}
        <Html>
          <div className={moonAnnotationClass}> {moonName} </div>
        </Html>
      </mesh>
      {/* we create the orbit line for the moon based on the info from we get passed in */}
      <Ecliptic xRadius={moonXRadius} zRadius={moonZRadius} color={moonColor} planetXPostion={planetXPostion} planetZPostion={planetZPostion}/>
    </>
  )
}


//creates the line that shows the bodies' orbits by making a set of points and then connecting them
function Ecliptic({ xRadius, zRadius, color, planetXPostion, planetZPostion }) {
  //an array with all the points 
  const points = [];
  //sets the number of points you want in your orbit. The more points the more circular it looks
  const numberOfPoints = 64
  for (let index = 0; index < numberOfPoints; index++) {
    // find the ange needed between each point based on the amount of points we have
    const angle = (index / numberOfPoints) * 2 * Math.PI;
    // find the cordinates for each point
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    // adds the new point as a vector3 to the array of all the other points
    points.push(new THREE.Vector3(x, 0, z));
  }
  //adds the frist point to the end of the array so we draw the last line that goes from the last point back to the start point
  points.push(points[0]);
  //draws the line beteen each point
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  //we check to see if there is a planetXPostion, if there isn't we know that we are a plaent and then just draw the orbit line 
  //based on the planet info. If there is a planetXPostion, we know that we are a moon, and as such, we factor in the 
  //planets X and Z positons so we center the moon's orbit around the planet and not the moon
  if (planetXPostion === undefined){
    return (
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color={color} linewidth={1} />
      </line>
    );
  }
  else{
    return (
      <line geometry={lineGeometry} position={[planetXPostion, 0, planetZPostion]} >
        <lineBasicMaterial attach="material" color={color} linewidth={.1} />
      </line>
    );
  }
}

//handles zooming into a body when you click it
function SelectToZoom({ children }) {  
  const api = useBounds()
  return (
    <group 
      onClick={(e) => {      
        //after we click we check through all the objects that is under the click. We look for the first object that is
        //not a line. We then zoom on on that object to fit the screen based on the margin number in Bounds in App
        if(e.object.type !== "Line") {                 
          ( e.delta <= 2 && api.refresh(e.object).fit())   
          //once we find the first object that is not a line, we stop looking for any other objects behind it       
          e.stopPropagation()
        }
      }}
      //if we  dont hit anything with our click, we move the camera to fit all the objects
      //so showing the whole solar system
      // onPointerMissed={(e) => {
      //   e.button === 0 && api.refresh().fit()
      // }}
      >
      {children}
    </group>
  )
}

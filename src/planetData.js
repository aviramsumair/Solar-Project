
//Helper functions to get some random numbers and names for our bodies
const random = (a, b) => a + Math.random() * b;
const randomInt = (a, b) => Math.floor(random(a, b));
//using numbers between 80-120 so we dont get colors that are too bight or too dark
const randomColor = () => `rgb(${randomInt(80, 50)}, ${randomInt(80, 50)}, ${randomInt(80, 50)})`; 
//creates a random name
function randomName(){
  return (Math.random() + 1).toString(36).substring(8).toUpperCase()
}

//arrays to hold the planet, moons, and rings info
const planetData = [];
let moonArray = [];
let ringArray=[];

//how many of each bodies we want 
const totalPlanets = 7;
const numberOfMoons = 5;
//settings for the planet rings
const planetRings = true;
// const multiplePlanetRings = true;
const numberOfRings = 2;

//populates the planet array with random planets
for (let index = 0; index < totalPlanets; index++) {  
  //variables to hold some info about the planet so we can pass it to the moons and rings 
  const randomPlanetColor = randomColor()
  const randomPlanetSize = random(0.7, 1.2) 
  const randomPlanetName = randomName()
  //populate the moon and ring arrays with objects
  makeMoons(randomPlanetName)
  makeRings(randomPlanetColor, randomPlanetSize)
  
  //builds a planet with using random parimaters
  planetData.push({
    id: index,
    color: randomPlanetColor,
    xRadius: (index + 2) * 12,
    zRadius: (index + 2) * 12,
    size: randomPlanetSize,
    speed: random(0.5, 0.2),
    offset: random(0, Math.PI * 2),
    name: randomPlanetName,
    //attach the moon and ring array to the planet object
    moons: moonArray,
    rings: ringArray
  });

  //resets the moon and ring array back to empty after we build a planet so the next planet can make their own
  moonArray=[]
  ringArray=[]
}

//function that creates an array of moons
function makeMoons(randomPlanetName){
  for (let index = 0; index < numberOfMoons; index++) {
    moonArray.push({
      id: index,
      moonColor: randomColor(),
      moonXRadius: ((index + 1) * 1.2),
      moonZRadius: ((index + 1) * 1.2),
      moonSize: random(0.5, 1) / 6,
      moonSpeed: random(0.5, 0.2),
      moonOffset: random(0, Math.PI * 2),
      moonName: randomPlanetName + "--" + (Math.random() + 1).toString(36).substring(10).toUpperCase()
    });
  }
}

//funtion that makes the rings around planets
function makeRings(color, size){
  //if planet rings is set to false, we return out of the function (i.e. dont make any rings)
  if (!planetRings){ return }

  for (let index = 0; index < numberOfRings; index++){
    
    let innerRadius = size + .2;
    let ringOuterRadius = size + .8;

    //we check the array of moons and if any of them have a radius that is inside the ring, we remove them from the array
    moonArray = moonArray.filter((moon) => {
      return (moon.moonXRadius > ringOuterRadius)
    })
    
    ringArray.push({
      ringColor: color,
      ringInnerRadius: innerRadius,
      ringOuterRadius: ringOuterRadius
      
    })  
  }
}

export default planetData;
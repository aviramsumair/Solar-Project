
//Helper functions to get some random numbers and names for our bodies
const random = (a, b) => a + Math.random() * b;
const randomInt = (a, b) => Math.floor(random(a, b));
//using numbers between 80-120 so we dont get colors that are too bight or too dark
const randomColor = () => `rgb(${randomInt(80, 50)}, ${randomInt(80, 50)}, ${randomInt(80, 50)})`;
//creates a random name
function randomName(){
  return planetName = (Math.random() + 1).toString(36).substring(8).toUpperCase()
}

//arrays to hold the planet and moon info
const planetData = [];
let moonArray = [];
//variable to hold the planet name during creation 
let planetName =""

//how many of each bodies we want 
const totalPlanets = 3;
const numberOfMoons = 3;

//populates the planet array with random planets
for (let index = 0; index < totalPlanets; index++) {
  planetData.push({
    id: index,
    color: randomColor(),
    xRadius: (index + 2) * 9,
    zRadius: (index + 2) * 9,
    size: random(0.5, 1),
    speed: random(0.5, 0.2),
    offset: random(0, Math.PI * 2),
    name: randomName(),
    //creates an array of individual moon for the planet
    moons: makeMoons(planetName)
  });
  //resets the moon array to empty after we build a planet
  moonArray=[]
}

//function that creates an array of moons
function makeMoons(){
  for (let index = 0; index < numberOfMoons; index++) {
    moonArray.push({
      id: index,
      moonColor: randomColor(),
      moonXRadius: ((index + 1.5) * 1.2),
      moonZRadius: ((index + 1.5) * 1.2),
      moonSize: random(0.5, 1) / 5,
      moonSpeed: random(0.5, 0.2),
      moonOffset: random(0, Math.PI * 2),
      moonName: planetName + "--" + (Math.random() + 1).toString(36).substring(10).toUpperCase()
    });
  }
  return moonArray
}

export default planetData;
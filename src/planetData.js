
//Helper functions to get some random numbers for our planet settings
const random = (a, b) => a + Math.random() * b;
const randomInt = (a, b) => Math.floor(random(a, b));
//using numbers between 80-120 so we dont get colors that are too bight or too dark
const randomColor = () => `rgb(${randomInt(80, 50)}, ${randomInt(80, 50)}, ${randomInt(80, 50)})`;


//create an array of random planets
const planetData = [];
const totalPlanets = 2;
for (let index = 0; index < totalPlanets; index++) {
  planetData.push({
    id: index,
    color: randomColor(),
    xRadius: (index + 2) * 6,
    zRadius: (index + 2) * 6,
    size: random(0.5, 1),
    speed: random(0.5, 0.2),
    offset: random(0, Math.PI * 2),
    name: (Math.random() + 1).toString(36).substring(7).toUpperCase(),
    moons: {
      moonId: 0,
      moonColor: randomColor(),
      moonXRadius: ((index + 2) * 1.2),
      moonZRadius: ((index + 2) * 1.2),
      moonSize: random(0.5, 1) / 5,
      moonSpeed: random(0.5, 0.2),
      moonOffset: random(0, Math.PI * 2),
      moonName: (Math.random() + 1).toString(36).substring(7).toUpperCase()
    }
  });
}

export default planetData;


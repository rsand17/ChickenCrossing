var xCor;
var yCor;
var driveUp;
var driveDown;
var cars = [];

var chicken;
var scoreElem;
var maxScore;
var collision;
var input;
var button;
var prompt;

var widthElement;
var mapXPos;

//0 is road, 1 is grass
var gameMap;
//0 is up, 1 is down. Is in sync with cars[]
var direction = [];

const url = "http://10.186.135.169:8080/records";

function preload() {
  chickenPic = loadImage('assets/chicken.png');
  carDownPic = loadImage('assets/car_down.png');
  carUpPic = loadImage('assets/car_up.png');
  roadPic = loadImage('assets/road.png');
  grassPic = loadImage('assets/grass.jpg');
}

function setup() {
  // put setup code here
  createCanvas(screen.width, 700);

  chicken = createSprite(xCor, yCor, chickenPic.width * 1.5, chickenPic.height * 1.5);
  chicken.addImage(chickenPic);

  reset();
}

function draw() {
  // put drawing code here
  background(0);

  //add roads and cars
  if ((camera.position.x + width) > mapXPos) {
    for (var i=0; i<2; i++) {
      var tile = int(random(1,11))
      if (gameMap[gameMap.length - 1] == 1) {
        gameMap.push(0);
        AddCars();
      } else if (tile < 4) {
        gameMap.push(1);
      } else {
        gameMap.push(0);
        AddCars();
      }
      mapXPos += widthElement;
    }
  }

  //display map
  for (var i=0; i<gameMap.length; i++) {
    if (gameMap[i] == 0) {
      DisplayMapElement(0, widthElement * i);
    } else if (gameMap[i] == 1) {
      DisplayMapElement(1, widthElement * i);
    }
  }

  drawSprites();

  camera.position.x += 3;

  //moves cars
  for (var i=0; i<cars.length; i++) {
    if(direction[i] == 0) {
      cars[i].velocity.y = -2;
    }
    else {
      cars[i].velocity.y = 2;
    }

    if(direction[i] == 0 && cars[i].position.y < -90) {
      cars[i].position.y = height;
    }
    else if(cars[i].position.x % 100 != 0 && cars[i].position.y > height) {
      cars[i].position.y = -90;
    }

    //check collisions
    if(chicken.overlap(cars[i]) || chicken.position.x < camera.position.x - screen.width / 2) {
      noLoop();
      background(0);
      var scoreVal = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Game ended! Your score was : ' + scoreVal);

      input = createInput();
      input.position(width / 2 - input.width / 2, height / 2);

      button = createButton('submit');
      button.position(input.x + input.width, height / 2);
      button.mousePressed(sendScore);

      prompt = createElement('h2', 'what is your name?')
      prompt.style('color', 'white');
      prompt.position(width / 2 - input.width / 2, height / 2 - 60);

      textAlign(CENTER);
      textSize(50);

      collision = true;
    }
  }

  //check score
  if(chicken.position.x > maxScore && !collision) {
    maxScore = chicken.position.x - 40;
    scoreElem.html('Score = ' + maxScore / (widthElement / 2));
  }
}

function AddCars() {
  direction.push(floor(random(0, 2)));
  cars.push(new Driver(cars.length, mapXPos+widthElement/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  if (direction[direction.length-1] == 0) {
    cars[cars.length-1].addImage(carUpPic);
  } else {
    cars[cars.length-1].addImage(carDownPic);
  }
  direction.push(floor(random(0, 2)));
  cars.push(new Driver(cars.length, mapXPos+widthElement*3/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  if (direction[direction.length-1] == 0) {
    cars[cars.length-1].addImage(carUpPic);
  } else {
    cars[cars.length-1].addImage(carDownPic);
  }
}

function DisplayMapElement(element, location) {
  //0 is road, 1 is grass, 2 is other
  switch (element) {
    case 0:
      image(roadPic, location, 0, widthElement, roadPic.height/2);
      image(roadPic, location, roadPic.height/2, widthElement, roadPic.height/2);
      image(roadPic, location, roadPic.height, widthElement, roadPic.height/2);
      break;
    case 1:
      image(grassPic, location, 0, widthElement, grassPic.height/2);
      image(grassPic, location, grassPic.height/2, widthElement, grassPic.height/2);
      image(grassPic, location, grassPic.height, widthElement, grassPic.height/2);
      break;
  }
}

function reset() {
  removeElements();

  scoreElem = createDiv('Score = 0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');

  maxScore = 0;
  collision = false;
  mapXPos = 0;
  gameMap = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1];

  //here's where I try to make the array empty to reset it
  //cars.splice(0,cars.length);
  for(var i = 0; i < cars.length; i++) {
    cars.pop();
  }

  driveUp = height;
  driveDown = -90;
  yCor = height / 2;
  xCor = 40;
  widthElement = roadPic.width/2;
  mapXPos = widthElement * 11;

  chicken.position.x = xCor;
  chicken.position.y = yCor;

  camera.position.x = chicken.position.x + (screen.width / 2 - 100);
  camera.position.y = chicken.position.y;

  drawSprites();
}

function sendScore() {
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(out) {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Info sent");
      }
    };

  var name = input.value();
  const record = {
    name: name,
    score: maxScore
  };

  xhttp.open("POST", "/records");
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(record));

  reset();
  loop();
}

function Driver(id, pos) {
  this.x = pos;

  if(direction[direction.length-1] == 0) {
    this.y = driveUp;
  }
  else {
    this.y = driveDown;
  }
}

function keyPressed() {
  switch (keyCode) {
    case 65: //left
      chicken.position.x -= widthElement/2;
      break;
    case 68: //right
      chicken.position.x += widthElement/2;
      break;
    case 83: //up
      chicken.position.y += 64;
      break;
    case 87: //down
      chicken.position.y -= 64;
      break;
  }
  //return false;
}

var xCor = 40;
var yCor;
var driveUp;
var driveDown;
var cars = [];
var gameMap = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1];
var chicken;
var scoreElem;
var maxScore = 0;
var widthElement;
var mapXPos = 0;

function preload() {
  chickenPic = loadImage('assets/chicken.png');
  carDownPic = loadImage('assets/car_down.png');
  carUpPic = loadImage('assets/car_up.png');
  roadPic = loadImage('assets/road.png');
  grassPic = loadImage('assets/grass.jpg');
}

function setup() {
  // put setup code here
  scoreElem = createDiv('Score = 0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');

  createCanvas(screen.width, 700);
  driveUp = height;
  driveDown = -90;
  yCor = height / 2;
  widthElement = roadPic.width/2;
  mapXPos = widthElement * 11;

  chicken = createSprite(xCor, yCor, chickenPic.width * 1.5, chickenPic.height * 1.5);
  chicken.addImage(chickenPic);

  /*for(var i = 0; i < 30; i++) {
    cars.push(new Driver(i));
    cars[i] = createSprite(cars[i].x, cars[i].y);
    if(cars[i].position.x % 100 == 0) {
      cars[i].addImage(carUpPic);
    }
    else {
      cars[i].addImage(carDownPic);
    }

  } */

  camera.position.x = chicken.position.x + 250;
  camera.position.y = chicken.position.y;

  drawSprites();
}

function draw() {
  // put drawing code here
  background(0);

  //add roads
  if ((camera.position.x + width) > mapXPos) {
    //console.log(camera.position.x);
    //console.log(width);
    //console.log(mapXPos);
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

  camera.position.x += 3 /*chicken.position.x + 250*/;

  //moves cars
  for (var i=0; i<cars.length; i++) {
    if(cars[i].position.x % 100 == 0) {
      cars[i].velocity.y = -2;
    }
    else {
      cars[i].velocity.y = 2;
    }

    if(cars[i].position.x % 100 == 0 && cars[i].position.y < -90) {
      cars[i].position.y = height;
    }
    else if(cars[i].position.x % 100 != 0 && cars[i].position.y > height) {
      cars[i].position.y = -90;
    }

    //check collisions
    if(chicken.overlap(cars[i]) || chicken.position.x < 0) {
      noLoop();
      var scoreVal = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Game ended! Your score was : ' + scoreVal);
    }
  }

  //check score
  if(chicken.position.x > maxScore) {
    maxScore = chicken.position.x - 40;
    scoreElem.html('Score = ' + maxScore / (widthElement / 2));
  }
}

function AddCars() {
  cars.push(new Driver(cars.length, mapXPos+widthElement/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(carDownPic);
  cars.push(new Driver(cars.length, mapXPos+widthElement*3/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(carDownPic);
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

function Driver(id, pos) {
  this.x = pos;

  if(this.x % 100 == 0) {
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
}

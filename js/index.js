// Game constants and variable

let direction = { x: 0, y: 0 };
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let inputDir = { x: 0, y: 0 };
let score = 0;
let movesCount = 0;
let a = 2;
let b = 17;
let food = {
  x: Math.round(a + (b - a) * Math.random()),
  y: Math.round(a + (b - a) * Math.random()),
};
let snakeLengthInit = snakeArr.length;
let snakeLengthFinal = 0;

// Setting initial score on score-board

var scoreBoard = document.getElementById("scoreBoard");
var par = document.createElement("p");
scoreBoard.appendChild(par);
par.innerHTML = "";
par.innerHTML = 0;

// GAME FUNCTIONS

//---------------- 1) checks if there is any collision--------------

function isCollide(snakeArray) {
  // colliding of snake with boundary

  if (snakeArr[0].x <= 0 || snakeArr[0].x >= 25) return true;

  if (snakeArr[0].y <= 0 || snakeArr[0].y >= 25) return true;

  // colliding snake head with its own body

  for (let i = 1; i < snakeArr.length; i++) {
    if (snakeArr[0].x === snakeArr[i].x && snakeArr[0].y === snakeArr[i].y)
      return true;
  }

  return false;
}

// ---------------2) Checks if the snake is starving-------------------

function isStarving() {
  return score < 0 ? true : false;
}

//----------------3) checks if the game is over--------------------------

function gameOver(reason) {
  snakeArr = [{ x: 13, y: 15 }];
  inputDir = { x: 0, y: 0 };
  alert("Snake died due to " + reason + " ! Game is over !");
  score = 0;
}

//----------------4) checks if snake has eaten the food ------------

function hasEatenFood() {
  return snakeArr[0].y === food.y && snakeArr[0].x === food.x;
}

//----------------5)Displays the snake and food on board-------------

function displaySnakeAndFood() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  // display the snake

  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    board.appendChild(snakeElement);

    if (index === 0) snakeElement.classList.add("head");
    else if (index === snakeArr.length - 1) snakeElement.classList.add("tail");
    else snakeElement.classList.add("snakeBody");
  });

  //  display the food particle

  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  board.appendChild(foodElement);
  foodElement.classList.add("food");
}

//--------------- 6) Moves the snake----------------

function moveSnake(snakeArr) {
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    const element = snakeArr[i];
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;
}

// DEFINING MAIN FUNCTION'S BODY

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

// All the game logic is embedded in gameEngine()

// GAME ENGINE

function gameEngine() {
  // If any time score becomes negative , it means snake died due to starvation and game is over

  if (isStarving()) gameOver("Starvation");

  // Speeding Up after every 3 food being eaten

  if (snakeLengthFinal === snakeLengthInit + 3) {
    speed += 2;
    snakeLengthInit = snakeLengthFinal;
  }

  // part1 : updating snake array

  if (isCollide(snakeArr)) gameOver("Collision");

  // If the snake has eaten the food , increment the score and regenerate food with a new random location
  // Also increase the length of the snake
  if (hasEatenFood()) {
    // Increase the score
    score += 5;

    // Moves will be counted again after eating a food
    movesCount = 0;
    par.innerHTML = score;

    // Increasing the size of the snake at the end of its body

    snakeArr.push({
      x: snakeArr[snakeArr.length - 1].x,
      y: snakeArr[snakeArr.length - 1].y,
    });
    snakeLengthFinal = snakeArr.length;

    // Randomizing the next food location

    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };

    // random() -> generates a pseudo random number between 0 and 1
    // To get a rand no from a to b we used a+(b-a)*that random no. and then round it to integer
  }

  moveSnake(snakeArr);

  displaySnakeAndFood();
}

// Main logic starts here : execution starts from here
window.requestAnimationFrame(main);

// EVENT LISTENERS

window.addEventListener("keydown", (e) => {
  inputDir = { x: -1, y: 0 }; // start the game

  // This line shows that if any key is pressed game will start and snake will move to left by default

  if (movesCount === 5) {
    score -= 1; // for every 3 moves used , 1 score will be deducted
    par.innerHTML = "";
    par.innerHTML = score;
    movesCount = 0;
  }

  switch (e.key) {
    case "ArrowUp":
      // console.log("Up") ;
      inputDir.x = 0;
      inputDir.y = -1;
      movesCount++;
      break;

    case "ArrowDown":
      // console.log("Down") ;
      inputDir.x = 0;
      inputDir.y = 1;
      movesCount++;
      break;

    case "ArrowLeft":
      // console.log("Left") ;
      inputDir.x = -1;
      inputDir.y = 0;
      movesCount++;
      break;

    case "ArrowRight":
      // console.log("Right") ;
      inputDir.x = 1;
      inputDir.y = 0;
      movesCount++;
      break;

    default:
      // console.log("Other Key Pressed!") ;
      break;
  }
});
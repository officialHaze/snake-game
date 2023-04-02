const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const boardWidth = gameBoard.offsetWidth;
const boardHeight = gameBoard.offsetHeight;
const boardColor = "black";
const snakeColor = "lightgreen";
const foodColor = "yellow";

let isGameStarted = false;

const boxSize = 20; //size of each box inside the grid

const cols = boardHeight * boxSize;
const rows = boardWidth * boxSize;

//snake movement speed
let xVelocity = boxSize;
let yVelocity = 0;

//food positions
let foodX;
let foodY;

let intervalId = null;

//snake body into x,y co-ordinate segments
const snakeBody = [
	{ x: boxSize * 10, y: boxSize * 10 }, //initial head
	// { x: boxSize * 2, y: 0 },
	// { x: boxSize, y: 0 },
	// { x: 0, y: 0 },
];

window.addEventListener("keyup", handleKeyboardEvents);

prepGameBoard(); //prepping the game board

function prepGameBoard() {
	drawBoard();
	generateFoodCoordinates();
	drawFood();
	drawSnakeHead();
	drawSnakeBody();
}

//start the game
function gameStart() {
	if (isGameStarted) {
		intervalId = setInterval(() => {
			drawBoard();
			drawFood();
			moveSnake();
			drawSnakeHead();
			drawSnakeBody();
			checkForGameOver();
		}, 75);
	}
}

//draws the board
function drawBoard() {
	ctx.fillStyle = boardColor;
	ctx.fillRect(0, 0, cols, rows);
}

//draws food on the board
function drawFood() {
	ctx.beginPath();
	ctx.fillStyle = foodColor;
	ctx.roundRect(foodX, foodY, boxSize, boxSize, 10);
	ctx.fill();
}

//generates random x,y co-ordinates for the food element
function generateFoodCoordinates() {
	function generateRandCoordinate(min, max) {
		const randomNum = Math.floor((Math.random() * (max - min)) / boxSize) * boxSize;
		return randomNum;
	}
	foodX = generateRandCoordinate(0, boardWidth - boxSize);
	foodY = generateRandCoordinate(0, boardHeight - boxSize);
}

//draws the snake head on the board
function drawSnakeHead() {
	ctx.beginPath();
	ctx.fillStyle = "red";
	// snakeBody.forEach(segment => {
	// 	ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
	// });
	ctx.roundRect(snakeBody[0].x, snakeBody[0].y, boxSize, boxSize, 3);
	ctx.fill();
}

//draws the snake on board
function drawSnakeBody() {
	ctx.beginPath();
	ctx.fillStyle = snakeColor;
	if (snakeBody.length > 1) {
		for (let i = 1; i < snakeBody.length; i++) {
			ctx.roundRect(snakeBody[i].x, snakeBody[i].y, boxSize, boxSize, 3);
			ctx.fill();
		}
	}
}

//moves the snake
function moveSnake() {
	//only need to move the head
	const head = {
		x: snakeBody[0].x + xVelocity,
		y: snakeBody[0].y + yVelocity,
	};
	snakeBody.unshift(head);
	//checks wether food was eaten
	if (foodX === snakeBody[0].x && foodY === snakeBody[0].y) {
		handleFoodEaten(); //handles when food is eaten
	} else {
		snakeBody.pop();
	}
}

//handles when food is eaten
function handleFoodEaten() {
	//remove the food from prev position
	function removePrevFood() {
		ctx.beginPath();
		ctx.fillStyle = boardColor;
		ctx.fillRect(foodX, foodY, boxSize, boxSize);
	}
	removePrevFood(); //remove the food from current position
	generateFoodCoordinates(); //then generate new food cordinates
}

//handle keyboard events
function handleKeyboardEvents(e) {
	//starts the game
	if (e.keyCode === 32) {
		isGameStarted = true;
		gameStart();
	}

	//changes snake direction
	const direction = e.key;
	const movingUp = yVelocity === -boxSize;
	const movingDown = yVelocity === boxSize;
	const movingLeft = xVelocity === -boxSize;
	const movingRight = xVelocity === boxSize;

	switch (true) {
		case direction === "ArrowUp" && !movingDown:
			yVelocity = -boxSize;
			xVelocity = 0;
			break;
		case direction === "ArrowDown" && !movingUp:
			yVelocity = boxSize;
			xVelocity = 0;
			break;
		case direction === "ArrowLeft" && !movingRight:
			xVelocity = -boxSize;
			yVelocity = 0;
			break;
		case direction === "ArrowRight" && !movingLeft:
			xVelocity = boxSize;
			yVelocity = 0;
			break;

		default:
			break;
	}
}

//checks for game over
function checkForGameOver() {
	//checks wether snake hits the wall
	if (
		snakeBody[0].x >= boardWidth ||
		snakeBody[0].y >= boardHeight ||
		snakeBody[0].x <= 0 ||
		snakeBody[0].y <= 0
	) {
		handleGameOver();
	}

	//checks wether snake hits itself
	for (let i = 1; i < snakeBody.length; i++) {
		if (snakeBody[0].x == snakeBody[i].x && snakeBody[0].y == snakeBody[i].y) {
			handleGameOver();
		}
	}
}

//handles game over
function handleGameOver() {
	clearInterval(intervalId);
	location.reload();
}

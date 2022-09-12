let board;
let context;

const rows = 25;
const cols = 50;
const cellSize = 20; // size of initial snake === size of cell inside the rectangle

// position of snake's head
let snakeX = 0;
let snakeY = 0;
let snakeTail = [];

// velocity of snake
let velocityX = 1;
let velocityY = 0;

// food 
let foodX;
let foodY;


// score
let score = 0;

// track prev key
let prevKey = 'ArrowRight';

let isGameOver = false;

const easy = document.querySelector('.easy')
const medium = document.querySelector('.medium')
const hard = document.querySelector('.hard')

let DIFFICULTY = 70;




window.onload = () => {
    board = document.getElementById('snake');
    context = board.getContext('2d');


    board.height = rows * cellSize;
    board.width = cols * cellSize;

    document.addEventListener('keyup', changeSnakeDirection);

    //restart the game on canvas click
    restartGame();

    placeFood();

    setInterval(update, DIFFICULTY);

}

function update() {
    // clear the screen
    createRectangle(0, 0, board.height, board.width)

    // check if game is over
    if (isGameOver) {
        // Game end screen
        createOrUpdateScore(`Game Over`, board.width / 2, board.height / 2 - 25, 'center', 50);

        createOrUpdateScore(`Score: ${score}`, board.width / 2, board.height / 2 + 25, 'center');

        createOrUpdateScore(`Click or Press ENTER to Start Again`, (cols * cellSize) / 2, board.height - 50, 'center');

        return;
    }



    // Write score
    createOrUpdateScore(`Score: ${score}`, 30, 40);

    // create first food
    createRectangle(foodX, foodY, cellSize, cellSize, 'lime');

    // update snake's length if eaten
    if (foodX === snakeX && foodY === snakeY) {
        // add food to snake's tail
        snakeTail.push([foodX, foodY]);

        //update score
        score += 10;

        // update food location
        placeFood();
    }

    // Update Snake's tail
    for (let i = snakeTail.length - 1; i > 0; i--) {
        snakeTail[i] = snakeTail[i - 1];
    }
    if (snakeTail.length) {
        snakeTail[0] = [snakeX, snakeY];
    }


    // Snake position
    snakeX += velocityX * cellSize;
    snakeY += velocityY * cellSize;

    createRectangle(snakeX, snakeY, cellSize, cellSize, 'orange');

    for (let i = 0; i < snakeTail.length; i++) {
        createRectangle(snakeTail[i][0], snakeTail[i][1], cellSize, cellSize, 'lime');
    }

    // snake crosses the wall
    if (snakeX < 0) snakeX = cols * cellSize;
    if (snakeX > cols * cellSize) snakeX = 0;
    if (snakeY < 0) snakeY = rows * cellSize;
    if (snakeY > rows * cellSize) snakeY = 0;

    // snake eats itself
    for (let i = 0; i < snakeTail.length; i++) {
        if (snakeX === snakeTail[i][0] && snakeY === snakeTail[i][1]) {
            gameOver();
        }
    }

}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * cellSize;
    foodY = Math.floor(Math.random() * rows) * cellSize;
}

function createRectangle(x, y, height, width, color = 'black') {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}


function createOrUpdateScore(text, x, y, textAlign = 'start', fontSize = 20) {
    context.fillStyle = "lime";
    context.font = `${fontSize}px Roboto Mono`;
    context.textAlign = textAlign;
    context.fillText(text, x, y);
}


function changeSnakeDirection(e) {
    if (e.code === 'ArrowUp') {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code === 'ArrowDown') {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code === 'ArrowLeft') {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code === 'ArrowRight') {
        velocityX = 1;
        velocityY = 0;
    }
}


function gameOver() {
    isGameOver = true;
    snakeTail = [];
    snakeX = 0;
    snakeY = 0;
    velocityX = 1;
    velocityY = 0;
}


function restartGame() {
    board.addEventListener('click', () => {
        isGameOver = false;
        score = 0;
    });
    document.addEventListener('keyup', e => {
        if (e.code === 'Enter') {
            isGameOver = false;
            score = 0;
        }
    })
}
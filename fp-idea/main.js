let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
let grid = 15;
let paddleHeight = grid * 5;
let maxPaddleY = canvas.height - grid - paddleHeight;
let keyIsPressed = false;

//global variables (gameon)
let arrowUpPressed = false;
let arrowDownPressed = false;

let paddleSpeed = 6;
let ballSpeed = 5;

let leftPaddle = {
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  w: grid,
  h: paddleHeight,
  accel: 0.7,
  arrowUpPressed: false,
  arrowDownPressed: false,

  //paddle velocity
  dy: 0,
};

let rightPaddle = {
  //middle of thing on right side
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  w: grid,
  h: paddleHeight,

  //paddle velocity
  dy: 0,
};

let ball = {
  //start middle of canvas
  x: canvas.width / 2,
  y: canvas.height / 2,
  widht: grid,
  height: grid,

  //when needed to reset ball position
  resetting: false,

  //velocity
  dx: ballSpeed,
  dy: -ballSpeed,
};

//collision detection
function collides(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

//game loop
function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //move paddles with velocity
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  //stop from going through walls
  if (leftPaddle.y < grid) {
    leftPaddle.y = grid;
  } else if (leftPaddle.y > maxPaddleY) {
    leftPaddle.y = grid;
  }

  if (rightPaddle.y < grid) {
    rightPaddle.y = grid;
  } else if (rightPaddle.y > maxPaddleY) {
    rightPaddle.y = maxPaddleY;
  }

  //draw paddles

  ctx.fillStyle = "white";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h); // rectangle

  //draw second paddle
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h);

  //move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  //wall boundary
  if (ball.y < grid) {
    ball.y = grid;
    ball.dy *= -1;
  } else if (ball.y + grid > canvas.height - grid) {
    ball.y = canvas.height - grid * 2;
    ball.dy *= -1;
  }

  //reset ball after scoring point
  if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;

    //time before ball launches
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }, 400);
  }

  if (collides(ball, leftPaddle)) {
    ball.dx *= -1;

    //move ball next to paddle otherwise collision happens agian
    //in next frame again
    ball.x = leftPaddle.x + leftPaddle.width;
  } else if (collides(ball, rightPaddle)) {
    ball.dx *= -1;

    ball.x = rightPaddle.x - ball.width;
  }

  //draw ball
  ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

  //line down the center
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    ctx.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
}

//moving the paddles
document.getElementById("keydown", keydownHandler);
function keydownHandler(e) {
  console.log("key pressed");
  //arrow up and down keys
  if (e.which === 38) {
    rightPaddle.dy = -paddleSpeed;
  } else if (e.which === 40) {
    rightPaddle.dy = paddleSpeed;
  }

  // w and s keys
  if (e.which === 87) {
    leftPaddle.dy = -paddleSpeed;
  } else if (e.which === 83) {
    leftPaddle.dy = paddleSpeed;
  }
}

//key up handler
document.getElementById("keyup", keyupHandler);
function keyupHandler(e) {
  console.log("key pressed");
  if (e.which === 38 || e.which === 40) {
    rightPaddle.dy = 0;
  }

  if (e.which === 83 || e.which === 87) {
    leftPaddle.dy = 0;
  }
}

//start game
requestAnimationFrame(loop);

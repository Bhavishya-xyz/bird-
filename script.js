// =====================================
// Flying Bird Game
// script.js - Part 1
// =====================================

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas Size
canvas.width = 400;
canvas.height = 600;

// Bird Object
const bird = {
    x: 80,
    y: 250,
    radius: 18,
    velocity: 0,
    gravity: 0.5,
    jumpPower: -8
};

// Game Variables
let score = 0;
let gameOver = false;

// =====================================
// Draw Background
// =====================================
function drawBackground() {

    if (bgImg.complete) {

        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    } else {

        ctx.fillStyle = "#70C5CE";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

    }

}
// =====================================
// Draw Bird
// =====================================

function drawBird() {

    if (birdImg.complete) {

        ctx.drawImage(
            birdImg,
            bird.x - bird.radius,
            bird.y - bird.radius,
            bird.radius * 2,
            bird.radius * 2
        );

    }

}
// =====================================
// Update Bird
// =====================================

function updateBird() {

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Top Limit
    if (bird.y < bird.radius) {

        bird.y = bird.radius;
        bird.velocity = 0;

    }

    // Bottom Limit
    if (bird.y > canvas.height - bird.radius) {

        bird.y = canvas.height - bird.radius;
        gameOver = true;

    }

}

// =====================================
// Keyboard Control
// Space = Jump
// =====================================

document.addEventListener("keydown", function (event) {

    if (event.code === "Space" && !gameOver) {

        bird.velocity = bird.jumpPower;

    }

});

// =====================================
// Draw Score
// =====================================

function drawScore() {

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Score : " + score, 20, 40);

}

// =====================================
// Game Over Screen
// =====================================

function drawGameOver() {

    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 60, 280);

}

// =====================================
// Game Loop
// =====================================
function gameLoop() {

    drawBackground();

    if (!gameOver) {

        updateBird();

        updatePipes();

        checkCollision();

    }

    drawPipes();

    drawBird();

    drawScore();

    if (!gameOver) {

        requestAnimationFrame(gameLoop);

    } else {

        drawGameOver();

        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText("Press R to Restart", 85, 330);

    }

}

gameLoop();
// =====================================
// Part 2 - Bamboo Pipes
// =====================================

// Pipe Variables
const pipeWidth = 70;
const pipeGap = 170;
const pipeSpeed = 2;

let pipes = [];

// Create First Pipe
createPipe();

// =====================================
// Create Pipe
// =====================================

function createPipe() {

    let topHeight = Math.floor(Math.random() * 220) + 80;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap,
        passed: false
    });

}

// =====================================
// Update Pipes
// =====================================

function updatePipes() {

    for (let i = 0; i < pipes.length; i++) {

        pipes[i].x -= pipeSpeed;

    }

    // Remove old pipe
    if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {

        pipes.shift();

    }

    // Create new pipe
    if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x < canvas.width - 220
    ) {

        createPipe();

    }

}

// =====================================
// Draw Bamboo Pipes
// =====================================

function drawPipes() {
function drawPipes() {

    for (let pipe of pipes) {

        if (bambooImg.complete) {

            // Top Pipe
            ctx.drawImage(
                bambooImg,
                pipe.x,
                0,
                pipeWidth,
                pipe.top
            );

            // Bottom Pipe
            ctx.drawImage(
                bambooImg,
                pipe.x,
                pipe.bottom,
                pipeWidth,
                canvas.height - pipe.bottom
            );

        } else {

            ctx.fillStyle = "green";

            ctx.fillRect(pipe.x,0,pipeWidth,pipe.top);

            ctx.fillRect(
                pipe.x,
                pipe.bottom,
                pipeWidth,
                canvas.height-pipe.bottom
            );

        }

    }

}

gameLoop();
// =====================================
// PART 3 - COLLISION, SCORE & RESTART
// =====================================

// Check Collision
function checkCollision() {

    for (let pipe of pipes) {

        // Bird touches pipe
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth
        ) {

            // Top pipe
            if (bird.y - bird.radius < pipe.top) {

                gameOver = true;

            }

            // Bottom pipe
            if (bird.y + bird.radius > pipe.bottom) {

                gameOver = true;

            }

        }

        // Increase Score
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {

            pipe.passed = true;
            score++;

        }

    }

}

// ================================
// Restart Game
// ================================

function restartGame() {

    bird.y = 250;
    bird.velocity = 0;

    score = 0;
    gameOver = false;

    pipes = [];
    createPipe();

    gameLoop();

}

// Press R to Restart

document.addEventListener("keydown", function(event){

    if(event.key === "r" || event.key === "R"){

        if(gameOver){

            restartGame();

        }

    }

});
// =====================================
// PART 4 - HAND GESTURE CONTROL
// =====================================

// Webcam
const videoElement = document.getElementById("video");

// Create MediaPipe Hands
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

// MediaPipe Settings
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

// Detect Hand
hands.onResults(onResults);

// Camera
const camera = new Camera(videoElement, {

    onFrame: async () => {

        await hands.send({ image: videoElement });

    },

    width: 640,
    height: 480

});

// Start Camera
camera.start();

// ===============================
// Hand Detection
// ===============================

function onResults(results) {

    if (results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0) {

        // Wrist Landmark
        let wrist = results.multiHandLandmarks[0][0];

        // Hand Up
        if (wrist.y < 0.45) {

            bird.velocity = bird.jumpPower;

        }

    }

}
// =====================================
// PART 5 - IMAGES
// =====================================

// Bird Image
const birdImg = new Image();
birdImg.src = "assets/bird.png";

// Background Image
const bgImg = new Image();
bgImg.src = "assets/background.png";

// Bamboo Image
const bambooImg = new Image();
bambooImg.src = "assets/bamboo.png";
    // =====================================
// SOUND
// =====================================

const jumpSound = new Audio("assets/jump.wav");
const hitSound = new Audio("assets/hit.wav");
    bird.velocity = bird.jumpPower;
jumpSound.play();
    if(gameOver){

    hitSound.play();

}
    // High Score

let highScore = localStorage.getItem("highScore") || 0;

if(score > highScore){

    highScore = score;

    localStorage.setItem("highScore",highScore);

}
    ctx.fillStyle="white";
ctx.font="22px Arial";
ctx.fillText("High : "+highScore,20,70);

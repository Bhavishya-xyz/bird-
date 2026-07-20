// ============================================
// Flying Bird Game
// script.js - Part 1
// ============================================

// ---------- Canvas ----------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// ---------- Bird ----------
const bird = {
    x: 80,
    y: 250,
    radius: 18,
    velocity: 0,
    gravity: 0.5,
    jump: -8
};

// ---------- Game ----------
let score = 0;
let gameOver = false;

// ---------- Background ----------
function drawBackground() {

    ctx.fillStyle = "#70C5CE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grass
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

}

// ---------- Bird ----------
function drawBird() {

    // Body
    ctx.fillStyle = "yellow";

    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(bird.x + 6, bird.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "orange";

    ctx.beginPath();
    ctx.moveTo(bird.x + 18, bird.y);
    ctx.lineTo(bird.x + 28, bird.y - 4);
    ctx.lineTo(bird.x + 28, bird.y + 4);
    ctx.closePath();
    ctx.fill();

}

// ---------- Update Bird ----------
function updateBird() {

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Top
    if (bird.y < bird.radius) {

        bird.y = bird.radius;
        bird.velocity = 0;

    }

    // Bottom
    if (bird.y > canvas.height - 30 - bird.radius) {

        bird.y = canvas.height - 30 - bird.radius;
        gameOver = true;

    }

}

// ---------- Keyboard ----------
document.addEventListener("keydown", function (e) {

    if (e.code === "Space" && !gameOver) {

        bird.velocity = bird.jump;

    }

});

// ---------- Score ----------
function drawScore() {

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Score : " + score, 20, 40);

}

// ---------- Game Over ----------
function drawGameOver() {

    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 60, 280);

}

// ---------- Game Loop ----------
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
        ctx.font = "22px Arial";
        ctx.fillText("Press R to Restart", 90, 330);

    }

}

gameLoop();

}
// ============================================
// script.js - Part 2 (M4)
// Pipes + Collision + Restart
// ============================================

// ---------- Pipe Settings ----------
const pipeWidth = 70;
const pipeGap = 170;
const pipeSpeed = 2.5;

let pipes = [];

// Create first pipe
createPipe();

// ---------- Create Pipe ----------
function createPipe() {

    let topHeight = Math.floor(Math.random() * 220) + 60;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap,
        passed: false
    });

}

// ---------- Update Pipes ----------
function updatePipes() {

    for (let pipe of pipes) {
        pipe.x -= pipeSpeed;
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

// ---------- Draw Pipes ----------
function drawPipes() {

    ctx.fillStyle = "#2E8B57";

    for (let pipe of pipes) {

        // Top Pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);

        // Bottom Pipe
        ctx.fillRect(
            pipe.x,
            pipe.bottom,
            pipeWidth,
            canvas.height - pipe.bottom
        );

        // Bamboo Rings
        ctx.strokeStyle = "#145A32";
        ctx.lineWidth = 3;

        for (let y = 30; y < pipe.top; y += 40) {
            ctx.beginPath();
            ctx.moveTo(pipe.x, y);
            ctx.lineTo(pipe.x + pipeWidth, y);
            ctx.stroke();
        }

        for (let y = pipe.bottom + 30; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(pipe.x, y);
            ctx.lineTo(pipe.x + pipeWidth, y);
            ctx.stroke();
        }

    }

}

// ---------- Collision ----------
function checkCollision() {

    for (let pipe of pipes) {

        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth
        ) {

            if (bird.y - bird.radius < pipe.top) {
                gameOver = true;
            }

            if (bird.y + bird.radius > pipe.bottom) {
                gameOver = true;
            }

        }

        // Score
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {

            pipe.passed = true;
            score++;

        }

    }

}

// ---------- Restart ----------
function restartGame() {

    bird.y = 250;
    bird.velocity = 0;

    score = 0;
    gameOver = false;

    pipes = [];
    createPipe();

    gameLoop();

}

document.addEventListener("keydown", function (e) {

    if ((e.key === "r" || e.key === "R") && gameOver) {

        restartGame();

    }

});

gameLoop();

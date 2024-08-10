const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake = [{ x: 2 * scale, y: 2 * scale }];
let food = { x: Math.floor(Math.random() * columns) * scale, y: Math.floor(Math.random() * rows) * scale };
let dx = scale;
let dy = 0;
let changingDirection = false;
let score = 0;

// Resize canvas to fit screen
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size - size % scale;
    canvas.height = size - size % scale;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Handle keyboard controls
document.addEventListener('keydown', changeDirection);

// Handle swipe controls
let touchStart = { x: 0, y: 0 };
let touchEnd = { x: 0, y: 0 };

canvas.addEventListener('touchstart', function(event) {
    touchStart = getTouchPosition(canvas, event);
    event.preventDefault();
}, false);

canvas.addEventListener('touchmove', function(event) {
    touchEnd = getTouchPosition(canvas, event);
    event.preventDefault();
}, false);

canvas.addEventListener('touchend', function(event) {
    handleSwipe();
    event.preventDefault();
}, false);

function getTouchPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;
    return { x, y };
}

function handleSwipe() {
    if (changingDirection) return;
    changingDirection = true;
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal movement
        if (dx > 0 && this.dx === 0) {
            this.dx = scale;
            this.dy = 0;
        } else if (dx < 0 && this.dx === 0) {
            this.dx = -scale;
            this.dy = 0;
        }
    } else {
        // Vertical movement
        if (dy > 0 && this.dy === 0) {
            this.dx = 0;
            this.dy = scale;
        } else if (dy < 0 && this.dy === 0) {
            this.dx = 0;
            this.dy = -scale;
        }
    }
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;
    const key = event.code;
    if (key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -scale;
    } else if (key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = scale;
    } else if (key === 'ArrowLeft' && dx === 0) {
        dx = -scale;
        dy = 0;
    } else if (key === 'ArrowRight' && dx === 0) {
        dx = scale;
        dy = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, scale, scale);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, scale, scale));

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * columns) * scale, y: Math.floor(Math.random() * rows) * scale };
    } else {
        snake.pop();
    }

    // Check for collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score is ${score}`);
    }
}

function update() {
    changingDirection = false;
    draw();
}

const gameInterval = setInterval(update, 100);

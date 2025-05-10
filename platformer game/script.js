// Game variables
let stickman = document.getElementById('stickman');
let gameContainer = document.getElementById('game-container');
let scoreElement = document.getElementById('score').querySelector('span');
let highScoreElement = document.getElementById('high-score').querySelector('span');
let gameOverElement = document.getElementById('game-over');
let finalScoreElement = document.getElementById('final-score');
let finalHighScoreElement = document.getElementById('final-high-score');
let restartBtn = document.getElementById('restart-btn');
let startScreen = document.getElementById('start-screen');
let startBtn = document.getElementById('start-btn');

// Stickman properties
let stickmanProps = {
  x: 50,
  y: 80,
  velocity: 0,
  speed: 5,
  jumpPower: 15,
  isJumping: false,
  gravity: 0.8
};

// Game state
let gameState = {
  isGameOver: false,
  score: 0,
  highScore: localStorage.getItem('stickmanHighScore') || 0,
  platforms: [],
  obstacles: [],
  coins: [],
  keys: {
    left: false,
    right: false,
    up: false
  },
  intervalId: null
};

// Initialize high score display
highScoreElement.textContent = gameState.highScore;

// Create initial platforms
function initializePlatforms() {
  gameState.platforms = [
    { x: 150, y: 150, width: 100 },
    { x: 320, y: 250, width: 120 },
    { x: 520, y: 180, width: 100 },
    { x: 700, y: 300, width: 80 }
  ];

  // Create platform elements
  gameState.platforms.forEach(platform => {
    const platformElement = document.createElement('div');
    platformElement.className = 'platform';
    platformElement.style.left = platform.x + 'px';
    platformElement.style.bottom = platform.y + 'px';
    platformElement.style.width = platform.width + 'px';
    gameContainer.appendChild(platformElement);
  });
}

// Event listeners for buttons
document.getElementById('left-btn').addEventListener('mousedown', () => {
  gameState.keys.left = true;
  stickman.style.transform = 'scaleX(-1)';
});

document.getElementById('left-btn').addEventListener('mouseup', () => {
  gameState.keys.left = false;
});

document.getElementById('right-btn').addEventListener('mousedown', () => {
  gameState.keys.right = true;
  stickman.style.transform = 'scaleX(1)';
});

document.getElementById('right-btn').addEventListener('mouseup', () => {
  gameState.keys.right = false;
});

document.getElementById('jump-btn').addEventListener('click', () => {
  if (!stickmanProps.isJumping) {
    stickmanProps.velocity = -stickmanProps.jumpPower;
    stickmanProps.isJumping = true;
    animateJump();
  }
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    gameState.keys.left = true;
    stickman.style.transform = 'scaleX(-1)';
  }
  if (event.key === 'ArrowRight' || event.key === 'd') {
    gameState.keys.right = true;
    stickman.style.transform = 'scaleX(1)';
  }
  if ((event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') && !stickmanProps.isJumping) {
    stickmanProps.velocity = -stickmanProps.jumpPower;
    stickmanProps.isJumping = true;
    animateJump();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    gameState.keys.left = false;
  }
  if (event.key === 'ArrowRight' || event.key === 'd') {
    gameState.keys.right = false;
  }
});

// Animate stickman jump
function animateJump() {
  const head = stickman.querySelector('.head');
  head.style.animation = 'jump 0.3s';
  setTimeout(() => {
    head.style.animation = '';
  }, 300);
}

// Check collision with platforms
function checkPlatformCollision() {
  let onPlatform = false;
  
  gameState.platforms.forEach(platform => {
    if (stickmanProps.x + 15 > platform.x && 
        stickmanProps.x - 15 < platform.x + platform.width &&
        stickmanProps.y <= platform.y + 20 && 
        stickmanProps.y >= platform.y - 5 && 
        stickmanProps.velocity >= 0) {
      stickmanProps.velocity = 0;
      stickmanProps.y = platform.y + 20;
      stickmanProps.isJumping = false;
      onPlatform = true;
    }
  });
  
  if (stickmanProps.y <= 80 && stickmanProps.velocity >= 0) {
    stickmanProps.velocity = 0;
    stickmanProps.y = 80;
    stickmanProps.isJumping = false;
    onPlatform = true;
  }
  
  return onPlatform;
}

// Spawn random obstacles
function spawnObstacle() {
  if (gameState.isGameOver) return;
  
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  
  const x = gameContainer.offsetWidth;
  const y = Math.random() * 300 + 100;
  
  obstacle.style.left = x + 'px';
  obstacle.style.bottom = y + 'px';
  
  gameContainer.appendChild(obstacle);
  
  gameState.obstacles.push({
    element: obstacle,
    x: x,
    y: y
  });
  
  setTimeout(spawnObstacle, Math.random() * 3000 + 2000);
}

// Spawn coins
function spawnCoin() {
  if (gameState.isGameOver) return;
  
  const coin = document.createElement('div');
  coin.className = 'coin';
  
  const x = gameContainer.offsetWidth;
  const y = Math.random() * 300 + 100;
  
  coin.style.left = x + 'px';
  coin.style.bottom = y + 'px';
  
  gameContainer.appendChild(coin);
  
  gameState.coins.push({
    element: coin,
    x: x,
    y: y
  });
  
  setTimeout(spawnCoin, Math.random() * 2000 + 1000);
}

// Update game state
function updateGame() {
  if (gameState.isGameOver) return;
  
  // Move stickman left and right
  if (gameState.keys.left && stickmanProps.x > 15) {
    stickmanProps.x -= stickmanProps.speed;
    animateLegs();
  }
  if (gameState.keys.right && stickmanProps.x < gameContainer.offsetWidth - 15) {
    stickmanProps.x += stickmanProps.speed;
    animateLegs();
  }
  
  // Apply gravity
  stickmanProps.velocity += stickmanProps.gravity;
  stickmanProps.y -= stickmanProps.velocity;
  
  // Check for platform collision
  checkPlatformCollision();
  
  // Update stickman position
  stickman.style.left = stickmanProps.x - 15 + 'px';
  stickman.style.bottom = stickmanProps.y + 'px';
  
  // Move obstacles
  gameState.obstacles.forEach((obstacle, index) => {
    obstacle.x -= 3;
    obstacle.element.style.left = obstacle.x + 'px';
    
    // Check collision with stickman
    if (Math.abs(obstacle.x - stickmanProps.x) < 20 && Math.abs(obstacle.y - stickmanProps.y) < 30) {
      gameOver();
    }
    
    // Remove obstacles that are off-screen
    if (obstacle.x < -30) {
      obstacle.element.remove();
      gameState.obstacles.splice(index, 1);
      updateScore(5); // Score for avoiding obstacle
    }
  });
  
  // Move coins
  gameState.coins.forEach((coin, index) => {
    coin.x -= 3;
    coin.element.style.left = coin.x + 'px';
    
    // Check collision with stickman
    if (Math.abs(coin.x - stickmanProps.x) < 20 && Math.abs(coin.y - stickmanProps.y) < 30) {
      coin.element.remove();
      gameState.coins.splice(index, 1);
      updateScore(10); // Score for collecting coin
      createCoinEffect(coin.x, coin.y);
    }
    
    // Remove coins that are off-screen
    if (coin.x < -30) {
      coin.element.remove();
      gameState.coins.splice(index, 1);
    }
  });
  
  // Check if stickman fell off the bottom
  if (stickmanProps.y < 0) {
    gameOver();
  }
}

// Animate stickman legs
function animateLegs() {
  const leftLeg = stickman.querySelector('.left-leg');
  const rightLeg = stickman.querySelector('.right-leg');
  
  const walkCycle = Math.sin(Date.now() / 100);
  leftLeg.style.transform = `rotate(${walkCycle * 20}deg)`;
  rightLeg.style.transform = `rotate(${-walkCycle * 20}deg)`;
}

// Create coin collection effect
function createCoinEffect(x, y) {
  const effect = document.createElement('div');
  effect.className = 'coin-effect';
  effect.style.left = x + 'px';
  effect.style.bottom = y + 'px';
  gameContainer.appendChild(effect);
  
  setTimeout(() => {
    effect.remove();
  }, 1000);
}

// Update score
function updateScore(points) {
  gameState.score += points;
  scoreElement.textContent = gameState.score;
  
  // Update high score if needed
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    highScoreElement.textContent = gameState.highScore;
    localStorage.setItem('stickmanHighScore', gameState.highScore);
  }
}

// Game over
function gameOver() {
  gameState.isGameOver = true;
  finalScoreElement.textContent = gameState.score;
  finalHighScoreElement.textContent = gameState.highScore;
  gameOverElement.style.display = 'block';
  
  // Shake game container
  gameContainer.style.animation = 'shake 0.5s';
  setTimeout(() => {
    gameContainer.style.animation = '';
  }, 500);
  
  // Stop game loop
  clearInterval(gameState.intervalId);
}

// Reset game
function resetGame() {
  // Clear obstacles and coins
  gameState.obstacles.forEach(obstacle => obstacle.element.remove());
  gameState.coins.forEach(coin => coin.element.remove());
  
  // Clear platforms
  document.querySelectorAll('.platform').forEach(platform => platform.remove());
  
  // Reset game state
  gameState.isGameOver = false;
  gameState.score = 0;
  gameState.obstacles = [];
  gameState.coins = [];
  
  // Reset stickman position
  stickmanProps.x = 50;
  stickmanProps.y = 80;
  stickmanProps.velocity = 0;
  stickmanProps.isJumping = false;
  
  stickman.style.left = stickmanProps.x - 15 + 'px';
  stickman.style.bottom = stickmanProps.y + 'px';
  stickman.style.transform = 'scaleX(1)';
  
  // Reset legs
  const leftLeg = stickman.querySelector('.left-leg');
  const rightLeg = stickman.querySelector('.right-leg');
  leftLeg.style.transform = 'rotate(0deg)';
  rightLeg.style.transform = 'rotate(0deg)';
  
  // Update score display
  scoreElement.textContent = '0';
  
  // Hide game over screen
  gameOverElement.style.display = 'none';
  
  // Initialize platforms
  initializePlatforms();
  
  // Start game loops
  startGame();
}

// Start game
function startGame() {
  startScreen.style.display = 'none';
  
  // Initialize platforms
  initializePlatforms();
  
  // Start spawning obstacles and coins
  setTimeout(spawnObstacle, 2000);
  setTimeout(spawnCoin, 1000);
  
  // Start game loop
  gameState.intervalId = setInterval(updateGame, 20);
}

// Restart game when button is clicked
restartBtn.addEventListener('click', resetGame);

// Start game when start button is clicked
startBtn.addEventListener('click', startGame);

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
  }
  
  @keyframes jump {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
  
  .coin-effect {
    position: absolute;
    width: 30px;
    height: 30px;
    background: radial-gradient(circle, rgba(255,215,0,0.8), rgba(255,215,0,0));
    border-radius: 50%;
    animation: coinPop 1s forwards;
  }
  
  @keyframes coinPop {
    0% { transform: scale(0.5); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
`;
document.head.appendChild(style);
import BLOCKS from "./blocks.js"

const CONFIG = {
    ROWS: 20,
    COLS: 10,
    INITIAL_DURATION: 700,
    FAST_DURATION: 10
};

let gameState = {
    score: 0,
    duration: CONFIG.INITIAL_DURATION,
    downInterval: null,
    tempMovingItem: null,
    movingItem: {
        type: "",
        direction: 0,
        top: 0,
        left: 3,
    }
};

const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const outer = document.querySelector(".outer");
const game = document.querySelector(".game");
const startButton = document.querySelector(".outer .start");
const restartButton = document.querySelector(".game-text > button");

// 초기 실행
init();

function init() {
  gameState.score = 0;
  scoreDisplay.innerText = 0;
  gameState.tempMovingItem = { ...gameState.movingItem };
  
  renderGrid();
  generateNewBlock();
}

// 그리드 생성
function renderGrid() {
  playground.innerHTML = "";

  for (let i = 0; i < CONFIG.ROWS; i++) {
    prependNewLine();
  }
}

function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < CONFIG.COLS; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
}

// 블록 생성
function renderBlocks(moveType = "") {
  const { type, direction, top, left } = gameState.tempMovingItem;
  
  // 이전 포지션 제거
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach(moving => moving.classList.remove(type, "moving"));

  // 새로운 포지션 계산 및 충돌 체크
  const isCollision = BLOCKS[type][direction].some(block => {
    const x = block[0] + left;
    const y = block[1] + top;
    
    const row = playground.childNodes[y];
    const target = row ? row.querySelector("ul").childNodes[x] : null;
    
    if (!checkEmpty(target)) return true;
    
    target.classList.add(type, "moving");
    return false;
  });

  if (isCollision) {
    handleCollision(moveType);
  } else {
    updateCurrentPosition();
  }
}

function handleCollision(moveType) {
  gameState.tempMovingItem = { ...gameState.movingItem };
  
  if (moveType === "retry") {
    stopGame();
  } else {
    setTimeout(() => {
      renderBlocks("retry");
      if (moveType === "top") seizeBlock();
    }, 0);
  }
}

function updateCurrentPosition() {
  const { top, left, direction } = gameState.tempMovingItem;
  gameState.movingItem = { ...gameState.movingItem, top, left, direction };
}

function seizeBlock() {
  document.querySelectorAll(".moving").forEach(moving => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
}

function checkMatch() {
  const rows = playground.childNodes;
  rows.forEach(row => {
    const cells = row.querySelectorAll("ul > li");
    const isMatched = Array.from(cells).every(cell => cell.classList.contains("seized"));
    
    if (isMatched) {
      row.remove();
      prependNewLine();
      gameState.score++;
      scoreDisplay.innerText = gameState.score;
    }
  });
  generateNewBlock();
}

function generateNewBlock() {
  clearInterval(gameState.downInterval);
  gameState.downInterval = setInterval(() => moveBlock("top", 1), gameState.duration);

  const blockKeys = Object.keys(BLOCKS);
  const randomType = blockKeys[Math.floor(Math.random() * blockKeys.length)];

  gameState.movingItem = { type: randomType, direction: 0, top: 0, left: 3 };
  gameState.tempMovingItem = { ...gameState.movingItem };
  renderBlocks();
}

function checkEmpty(target) {
  return target && !target.classList.contains("seized");
}

function moveBlock(moveType, amount) {
  gameState.tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}

function changeDirection() {
  gameState.tempMovingItem.direction = (gameState.tempMovingItem.direction + 1) % 4;
  renderBlocks();
}

function dropBlock() {
  clearInterval(gameState.downInterval);
  gameState.downInterval = setInterval(() => moveBlock("top", 1), CONFIG.FAST_DURATION);
}

function stopGame() {
  clearInterval(gameState.downInterval);
  gameText.style.display = "flex";
}

document.addEventListener("keydown", e => {
  const actions = {
    ArrowRight: () => moveBlock("left", 1),
    ArrowLeft: () => moveBlock("left", -1),
    ArrowDown: () => moveBlock("top", 1),
    ArrowUp: () => changeDirection(),
    " ": () => dropBlock() 
  };

  if (actions[e.key]) {
    actions[e.key]();
  }
});

startButton.addEventListener("click", () => {
  outer.style.display = "none";
  game.style.display = "block";
  init();
});

restartButton.addEventListener("click", () => {
  gameText.style.display = "none";
  init();
})

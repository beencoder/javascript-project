const CONFIG = {
  GAME_TIME: 6,
  API_URL: "https://random-word-api.herokuapp.com/word?number=100"
};

let gameState = {
  score: 0,
  time: CONFIG.GAME_TIME,
  isPlaying: false,
  words: [],
  timeInterval: null,
  checkInterval: null
};

const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");

// 초기 실행
init(); 

async function init() {
  updateButton("게임로딩중...");
  await fetchWords();
  wordInput.addEventListener("input", checkMatch);
}

// 단어 불러오기
async function fetchWords() {
  try {
    const response = await axios.get(CONFIG.API_URL);
    gameState.words = response.data.filter(word => word.length < 10);
    updateButton("게임시작");
  } catch (error) {
    console.error("단어를 불러오는 중 오류 발생:", error);
    updateButton("로딩실패");
  }
}

// 게임 실행
function run() {
  if (gameState.isPlaying) return;

  // 상태 초기화
  gameState.isPlaying = true;
  gameState.time = CONFIG.GAME_TIME;
  gameState.score = 0;
  
  // UI 업데이트
  wordInput.value = "";
  wordInput.focus();
  scoreDisplay.innerText = 0;
  setNextWord();
  
  clearInterval(gameState.timeInterval);
  clearInterval(gameState.checkInterval);
  
  gameState.timeInterval = setInterval(countDown, 1000);
  gameState.checkInterval = setInterval(checkStatus, 50);
  updateButton("게임중");
}

function checkStatus() {
  if (!gameState.isPlaying && gameState.time === 0) {
    updateButton("게임시작");
    clearInterval(gameState.checkInterval);
  }
}

// 단어 일치 체크
function checkMatch() {
  const isMatched = wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase();
  
  if (!isMatched || !gameState.isPlaying) return;

  gameState.score++;
  scoreDisplay.innerText = gameState.score;
  gameState.time = CONFIG.GAME_TIME;
  wordInput.value = "";
  setNextWord();
}

function setNextWord() {
  const { words } = gameState;
  const randomIndex = Math.floor(Math.random() * words.length);
  wordDisplay.innerText = words[randomIndex];
}

function countDown() {
  if (gameState.time > 0) {
    gameState.time--;
  } else {
    gameState.isPlaying = false;
    clearInterval(gameState.timeInterval);
  }
  timeDisplay.innerText = gameState.time;
}

function updateButton(text) {
    button.innerText = text;
    button.classList.toggle("loading", text !== "게임시작");
}

const playerState = {
  index: Math.floor(Math.random() * allMusic.length),
  isPaused: true,
  repeatMode: 'repeat' // repeat, repeat_one, shuffle
};
const dom = {
  wrapper: document.querySelector(".wrapper"),
  musicImg: document.querySelector(".img-area img"),
  musicName: document.querySelector(".song-details .name"),
  musicArtist: document.querySelector(".song-details .artist"),
  playPauseBtn: document.querySelector(".play-pause"),
  prevBtn: document.querySelector("#prev"),
  nextBtn: document.querySelector("#next"),
  mainAudio: document.querySelector("#main-audio"),
  progressArea: document.querySelector(".progress-area"),
  progressBar: document.querySelector(".progress-bar"),
  musicList: document.querySelector(".music-list"),
  ulTag: document.querySelector(".music-list ul"),
  repeatBtn: document.querySelector("#repeat-plist")
};

const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? '0' + sec : sec}`;
};

// 초기 실행
init();

function init() {
  renderPlaylist();
  loadMusic(playerState.index);
  setupEventListeners();
}

function loadMusic(index) {
  const song = allMusic[index];
  dom.musicName.innerText = song.name;
  dom.musicArtist.innerText = song.artist;
  dom.musicImg.src = `./assets/images/${song.src}.jpg`;
  dom.mainAudio.src = `./assets/media/songs/${song.src}.mp3`;
  updateCurrentPlayingUI();
}

function togglePlay() {
  const isPaused = dom.wrapper.classList.toggle("paused");
  const icon = dom.playPauseBtn.querySelector("i");
  
  if (isPaused) {
    icon.innerText = "pause";
    dom.mainAudio.play();
  } else {
    icon.innerText = "play_arrow";
    dom.mainAudio.pause();
  }
}

function changeMusic(isNext = true) {
  if (isNext) {
    playerState.index = (playerState.index + 1) % allMusic.length;
  } else {
    playerState.index = (playerState.index - 1 + allMusic.length) % allMusic.length;
  }
  loadMusic(playerState.index);
  dom.mainAudio.play();
  dom.wrapper.classList.add("paused");
  dom.playPauseBtn.querySelector("i").innerText = "pause";
}

function setupEventListeners() {
  dom.playPauseBtn.addEventListener("click", togglePlay);
  dom.prevBtn.addEventListener("click", () => changeMusic(false));
  dom.nextBtn.addEventListener("click", () => changeMusic(true));

  dom.mainAudio.addEventListener("timeupdate", (e) => {
    const { currentTime, duration } = e.target;
    const progressWidth = (currentTime / duration) * 100;
    dom.progressBar.style.width = `${progressWidth}%`;

    dom.wrapper.querySelector(".current-time").innerText = formatTime(currentTime);
  });

  dom.mainAudio.addEventListener("loadeddata", () => {
    dom.wrapper.querySelector(".max-duration").innerText = formatTime(dom.mainAudio.duration);
  });

  dom.progressArea.addEventListener("click", (e) => {
    const width = dom.progressArea.clientWidth;
    dom.mainAudio.currentTime = (e.offsetX / width) * dom.mainAudio.duration;
    dom.mainAudio.play();
    dom.wrapper.classList.add("paused");
  });

  // 반복 모드 변경
  dom.repeatBtn.addEventListener("click", () => {
    const modes = {
      repeat: { next: 'repeat_one', title: 'Song looped' },
      repeat_one: { next: 'shuffle', title: 'Playback shuffled' },
      shuffle: { next: 'repeat', title: 'Playlist looped' }
    };
    const currentMode = dom.repeatBtn.innerText;
    const { next, title } = modes[currentMode];
    
    dom.repeatBtn.innerText = next;
    dom.repeatBtn.setAttribute("title", title);
    playerState.repeatMode = next;
  });

  // 곡 종료 시
  dom.mainAudio.addEventListener("ended", () => {
    const mode = playerState.repeatMode;
    if (mode === 'repeat_one') {
      dom.mainAudio.currentTime = 0;
      dom.mainAudio.play();
    } else if (mode === 'shuffle') {
      let randIndex;
      do {
        randIndex = Math.floor(Math.random() * allMusic.length);
      } while (playerState.index === randIndex);
      playerState.index = randIndex;
      loadMusic(playerState.index);
      dom.mainAudio.play();
    } else {
      changeMusic(true);
    }
  });

  // 리스트 열기/닫기
  document.querySelector("#more-music").addEventListener("click", () => dom.musicList.classList.toggle("show"));
  document.querySelector("#close").addEventListener("click", () => dom.musicList.classList.remove("show"));
}

// 플레이리스트 실행 및 UI 업데이트
function renderPlaylist() {
  dom.ulTag.innerHTML = allMusic.map((song, i) => `
    <li data-index="${i}">
      <div class="row">
        <span>${song.name}</span>
        <p>${song.artist}</p>
      </div>
      <span id="duration-${i}" class="audio-duration">0:00</span>
      <audio id="audio-${i}" src="./assets/media/songs/${song.src}.mp3"></audio>
    </li>
  `).join("");

  // 각 곡의 길이 미리 가져오기
  allMusic.forEach((song, i) => {
    const audio = dom.ulTag.querySelector(`#audio-${i}`);
    audio.addEventListener("loadeddata", () => {
      const durationTag = dom.ulTag.querySelector(`#duration-${i}`);
      durationTag.innerText = formatTime(audio.duration);
      durationTag.setAttribute("data-duration", formatTime(audio.duration));
    });
  });

  dom.ulTag.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    playerState.index = Number(li.getAttribute("data-index"));
    loadMusic(playerState.index);
    dom.mainAudio.play();
    dom.wrapper.classList.add("paused");
    dom.playPauseBtn.querySelector("i").innerText = "pause";
  });
}

function updateCurrentPlayingUI() {
  const allLi = dom.ulTag.querySelectorAll("li");
  allLi.forEach((li, i) => {
    const durationTag = li.querySelector(".audio-duration");
    if (i === playerState.index) {
      li.classList.add("playing");
      durationTag.innerText = "Playing";
    } else {
      li.classList.remove("playing");
      durationTag.innerText = durationTag.getAttribute("data-duration") || "0:00";
    }
  });
}

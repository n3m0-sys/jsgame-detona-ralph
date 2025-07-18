// --------------------- [ESTADO GLOBAL] ---------------------
const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeleft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        alerta: document.getElementById("meuAlerta"),
    },
    value: {
        timerid: null,
        enemyTimerId: null,
        score: 0,
        lives: 1,
        timeleft: 60,
        curretTime: 60,
        introAudio: new Audio("./src/audios/intro.mp3"),
        hitAudio: new Audio("./src/audios/hit.m4a"),
        gameOverAudio: new Audio("./src/audios/game-over.mp3"),
    },
};

// --------------------- [BOTÕES DE CONTROLE] ---------------------
function setupStartButton() {
    const startButton = document.createElement("button");
    startButton.textContent = "INICIAR JOGO";
    styleButton(startButton);
    document.body.insertBefore(startButton, document.body.firstChild);
    startButton.addEventListener("click", initialize);
}

function setupPauseButton() {
    const pauseButton = document.createElement("button");
    pauseButton.textContent = "PAUSAR JOGO";
    styleButton(pauseButton);
    document.body.insertBefore(pauseButton, document.body.firstChild.nextSibling);
    pauseButton.addEventListener("click", togglePause);
}

function styleButton(button) {
    button.style.fontFamily = "'Press Start 2P', system-ui";
    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.border = "1px solid red";
    button.style.fontSize = "1.5rem";
    button.style.padding = "10px 20px";
    button.style.margin = "20px";
    button.style.cursor = "pointer";
}

// --------------------- [PAUSAR/RETOMAR JOGO] ---------------------
function togglePause() {
    const pauseButton = document.querySelectorAll("button")[1];
    if (state.value.timerid) {
        clearInterval(state.value.timerid);
        clearInterval(state.value.enemyTimerId);
        state.value.introAudio.pause();
        state.value.timerid = null;
        state.value.enemyTimerId = null;
        pauseButton.textContent = "RETOMAR JOGO";
        state.view.squares.forEach((square) => {
            square.classList.remove("enemy");
        });
    } else {
        moveEnemy();
        countDown();
        state.value.introAudio.play();
        pauseButton.textContent = "PAUSAR JOGO";
    }
}

// --------------------- [CONTADOR DE TEMPO] ---------------------
function countDown() {
    state.value.timerid = setInterval(() => {
        state.value.timeleft -= 1;
        state.view.timeleft.textContent = `TIME: ${state.value.timeleft} seconds`;
        if (state.value.timeleft === 0) {
            clearInterval(state.value.timerid);
            state.value.lives -= 1;
            state.view.lives.textContent = `x${state.value.lives}`;
            state.value.timeleft = 60;
            state.view.timeleft.textContent = `TIME: ${state.value.timeleft} seconds`;
            if (state.value.lives === 0) {
                gameOver();
            }
        }
    }, 1000);
}

// --------------------- [INIMIGOS NA TELA] ---------------------
function moveEnemy() {
    state.value.enemyTimerId = setInterval(randomSquare, 1000);
}

function randomSquare() {
    const randomIndex = Math.floor(Math.random() * state.view.squares.length);
    state.view.squares.forEach((square, index) => {
        if (index === randomIndex) {
            square.classList.add("enemy");
        } else {
            square.classList.remove("enemy");
        }
    });
}

// --------------------- [ACERTAR / ERRO] ---------------------
function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("click", hitBox);
    });
    playSoundIntro();
}

function hitBox(event) {
    const element = event.target;
    if (element.classList.contains("enemy")) {
        playSound(state.value.hitAudio, 0.2);
        element.classList.remove("enemy");
        state.value.score += 1;
        state.view.score.textContent = state.value.score;
    } else {
        playSoundGameOver();
        showAlert();
        state.value.lives -= 1;
        state.view.lives.textContent = `x${state.value.lives}`;
        if (state.value.lives === 0) {
            gameOver();
        }
    }
}

// --------------------- [ALERTAS NA TELA] ---------------------
function showAlert() {
    const alerta = document.getElementById("meuAlerta");
    alerta.style.position = "fixed";
    alerta.style.top = "50%";
    alerta.style.zIndex = "1";
    alerta.style.fontSize = "2rem";
    alerta.style.color = "red";
    alerta.style.textAlign = "center";
    alerta.style.backgroundColor = "black";
    alerta.style.left = "50%";
    alerta.style.transform = "translate(-50%, -50%)";
    alerta.classList.remove("alerta-escondido");
    setTimeout(() => {
        alerta.classList.add("alerta-escondido");
    }, 2000);
}

function showAlertGameOver() {
    const alerta = document.getElementById("game-over");
    alerta.style.fontFamily = "'Press Start 2P', system-ui";
    alerta.style.position = "fixed";
    alerta.style.zIndex = "1";
    alerta.style.fontSize = "2rem";
    alerta.style.color = "red";
    alerta.style.textAlign = "center";
    alerta.style.backgroundColor = "black";
    alerta.style.top = "50%";
    alerta.style.left = "50%";
    alerta.style.transform = "translate(-50%, -50%)";
    alerta.style.display = "block";
}

// --------------------- [GAME OVER] ---------------------
function gameOver() {
    clearInterval(state.value.timerid);
    clearInterval(state.value.enemyTimerId);

    console.log("Pausando intro...");
    state.value.introAudio.pause();

    // Garante que o áudio de intro pare imediatamente
    if (!state.value.introAudio.paused) {
        state.value.introAudio.pause();
        state.value.introAudio.currentTime = 0;
    }

    // Remove inimigos e cliques
    state.view.squares.forEach((square) => {
        square.removeEventListener("click", hitBox);
        square.classList.remove("enemy");
    });

    // Toca som de fim
    state.value.gameOverAudio.currentTime = 0;
    playSound(state.value.gameOverAudio, 0.8);

    // Exibe alerta
    const alerta = document.getElementById("game-over");
    alerta.style.display = "block";
}

// --------------------- [SOM] ---------------------
function playSound(audio, volume) {
    audio.volume = volume;
    audio.play();
}

function playSoundGameOver() {
    playSound(state.value.gameOverAudio, 0.8);
}

function playSoundIntro() {
    state.value.introAudio.volume = 0.6;
    state.value.introAudio.loop = true;
    if (state.value.introAudio.paused) {
        state.value.introAudio.play();
    }
}

// --------------------- [INICIALIZAÇÃO] ---------------------
function initialize() {
    moveEnemy();
    addListenerHitBox();
    countDown();
    state.view.alerta.classList.add("alerta-escondido");
}

document.addEventListener("DOMContentLoaded", () => {
    setupStartButton();
    setupPauseButton();
});

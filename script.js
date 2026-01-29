let leftShore = ['farmer', 'wolf', 'sheep', 'lettuce'];
let rightShore = [];
let boat = [];
let boatPosition = 'left';

// Variables del timer
let timerInterval = null;
let startTime = null;
let elapsedTime = 0;
let timerRunning = false;

Notiflix.Report.init({
    titleFontSize: '24px',
    messageFontSize: '16px',
    buttonFontSize: '15px',
    cssAnimationStyle: 'zoom',
    plainText: false,
    rtl: false,
    svgSize: '80px',
    messageMaxLength: 3000,
    backOverlay: true,
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    
    // Estas propiedades centran el contenido
    cssAnimation: true,
    cssAnimationDuration: 360,
});

function getImage(char) {
    const images = {
        'farmer': './assets/img/farmer.png',
        'wolf': './assets/img/wolf.png',
        'sheep': './assets/img/sheep.png',
        'lettuce': './assets/img/lettuce.png'
    };
    return `<img src="${images[char]}" alt="${char}" class="character-img">`;
}

function moveCharacter(character) {
    // Iniciar el timer en el primer movimiento
    if (!timerRunning) {
        startTimer();
    }

    if (boatPosition === 'left' && leftShore.includes(character) && boat.length < 2) {
        leftShore = leftShore.filter(item => item !== character);
        boat.push(character);
    } else if (boatPosition === 'right' && rightShore.includes(character) && boat.length < 2) {
        rightShore = rightShore.filter(item => item !== character);
        boat.push(character);
    } else if (boat.includes(character)) {
        boat = boat.filter(item => item !== character);
        if (boatPosition === 'left') {
            leftShore.push(character);
        } else {
            rightShore.push(character);
        }
    }
    renderGame();
}

function crossRiver() {
    if (boat.length > 0) {
        boatPosition = (boatPosition === 'left') ? 'right' : 'left';
        renderGame();
    }
}

function renderGame() {
   document.getElementById('left-shore').innerHTML = leftShore.map(char => getImage(char)).join('');
    document.getElementById('right-shore').innerHTML = rightShore.map(char => getImage(char)).join('');

        const boatEl = document.getElementById('boat');
    boatEl.innerHTML = boat.map(char => getImage(char)).join('');

    const crossBtn = document.getElementById('cross-button');

    if (boatPosition === 'left') {
        crossBtn.innerHTML = "Llevar ➡";
        boatEl.classList.remove('boat-flipped');
    } else {
        crossBtn.innerHTML = "Llevar ⬅";
        boatEl.classList.add('boat-flipped');
    }
    checkGameOver();
}



function resetGame() {
    window.location.href = 'hiScores.html';
}

function checkGameOver() {
    let message = "";
    let isGameOver = false;
    let isVictory = false;
    let imageUrl = "";
    
    if ((leftShore.includes('wolf') && leftShore.includes('sheep') && !leftShore.includes('farmer')) ||
        (rightShore.includes('wolf') && rightShore.includes('sheep') && !rightShore.includes('farmer'))) {
        message = '¡El lobo se comió a la oveja!';
        imageUrl = 'assets/img/defeatW.png';
        isGameOver = true;
    } else if ((leftShore.includes('sheep') && leftShore.includes('lettuce') && !leftShore.includes('farmer')) ||
        (rightShore.includes('sheep') && rightShore.includes('lettuce') && !rightShore.includes('farmer'))) {
        message = '¡La oveja se comió la lechuga!';
        imageUrl = 'assets/img/defeatS.png';
        isGameOver = true;
    } else if (rightShore.length === 4) {
        message = '¡Has cruzado con éxito el río!';
        imageUrl = 'assets/img/victory.png';
        isVictory = true;
    }

    if (isVictory) {
        stopTimer();
        const finalTime = getFormattedTime();
        setTimeout(() => {
            Notiflix.Report.success(
                '¡Felicidades! 🎉',
                `<img src="${imageUrl}" style="width: 150px; margin: 15px auto; display: block; border-radius: 10px;"><br>${message}<br><br>⏱️ Tiempo: ${finalTime}`,
                'Volver al menú',
                function() {
                    resetGame();
                }
            );
        }, 100);
    } else if (isGameOver) {
        stopTimer();
        setTimeout(() => {
            Notiflix.Report.failure(
                'Game Over 😢',
                `<img src="${imageUrl}" style="width: 150px; margin: 15px auto; display: block; border-radius: 10px;"><br>${message}`,
                'Volver al menú',
                function() {
                    resetGame();
                }
            );
        }, 100);
    }
}
// Funciones del timer
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 100);
    }
}

function stopTimer() {
    if (timerRunning) {
        timerRunning = false;
        clearInterval(timerInterval);
    }
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const centiseconds = Math.floor((elapsedTime % 1000) / 10);
    document.getElementById("timer").textContent = 
        `⏱️ ${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
}

function getFormattedTime() {
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const centiseconds = Math.floor((elapsedTime % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
}



renderGame();
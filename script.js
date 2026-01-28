let leftShore = ['farmer', 'wolf', 'sheep', 'lettuce'];
let rightShore = [];
let boat = [];
let boatPosition = 'left';

function getImage(char) {
    const images = {
        'farmer': 'assets/img/farmer.png',
        'wolf': 'assets/img/wolf.png',
        'sheep': 'assets/img/sheep.png',
        'lettuce': 'assets/img/lettuce.png'
    };
    return `<img src="${images[char]}" alt="${char}" class="character-img">`;
}

function moveCharacter(character) {
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
        crossBtn.innerHTML = "Girar ⬅";
        boatEl.classList.remove('boat-flipped');
    } else {
        crossBtn.innerHTML = "Girar ➡";
        boatEl.classList.add('boat-flipped');
    }
    checkGameOver();
}



function resetGame() {
    leftShore = ['farmer', 'wolf', 'sheep', 'lettuce'];
    rightShore = [];
    boat = [];
    boatPosition = 'left';
    renderGame();
}

function checkGameOver() {
    let message = "";
    if ((leftShore.includes('wolf') && leftShore.includes('sheep') && !leftShore.includes('farmer')) ||
        (rightShore.includes('wolf') && rightShore.includes('sheep') && !rightShore.includes('farmer'))) {
        message = '¡El lobo se comió a la oveja! Juego Terminado.';
    } else if ((leftShore.includes('sheep') && leftShore.includes('lettuce') && !leftShore.includes('farmer')) ||
        (rightShore.includes('sheep') && rightShore.includes('lettuce') && !rightShore.includes('farmer'))) {
        message = '¡La oveja se comió la lechuga! Juego Terminado.';
    } else if (rightShore.length === 4) { // Condición de victoria simplificada
        message = '¡Felicidades! Has cruzado con éxito el río.';
    }

    if (message) {
        // Usamos un pequeño delay para que el render se complete antes del alert
        setTimeout(() => {
            alert(message);
            resetGame();
        }, 100);
    }
}


renderGame();

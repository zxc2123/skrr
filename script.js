let secretNumbers = [];
let attempts = 0;
const history = [];

const numberRangeSelect = document.getElementById('numberRange');
const digitCountSelect = document.getElementById('digitCount');
const inputGrid = document.getElementById('inputGrid');
const submitButton = document.getElementById('submitButton');
const resultMessage = document.getElementById('resultMessage');
const tryCountDisplay = document.getElementById('tryCount');
const restartButton = document.getElementById('restartButton');
const ruleButton = document.getElementById('ruleButton');
const rulesPopup = document.getElementById('rulesPopup');
const closePopup = document.getElementById('closePopup');

function generateSecretNumbers(range, count) {
    const numbers = Array.from({ length: range }, (_, i) => i + 1);
    let result = [];
    while (result.length < count) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        result.push(numbers.splice(randomIndex, 1)[0]);
    }
    return result;
}

function updateInputGrid() {
    const digitCount = parseInt(digitCountSelect.value);
    inputGrid.innerHTML = '';
    for (let i = 0; i < digitCount; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 15;
        input.required = true;
        inputGrid.appendChild(input);
    }
}

function checkAnswer() {
    const inputs = Array.from(inputGrid.getElementsByTagName('input'));
    const userNumbers = inputs.map(input => parseInt(input.value));
    const range = parseInt(numberRangeSelect.value);
    const digitCount = parseInt(digitCountSelect.value);

    if (userNumbers.length !== digitCount || new Set(userNumbers).size !== digitCount) {
        resultMessage.textContent = '모든 숫자를 정확히 입력해주세요!';
        return;
    }

    let strikes = 0;
    let balls = 0;

    userNumbers.forEach((num, index) => {
        if (num === secretNumbers[index]) {
            strikes++;
        } else if (secretNumbers.includes(num)) {
            balls++;
        }
    });

    attempts++;
    tryCountDisplay.textContent = `시도횟수: ${attempts}`;
    
    const resultText = strikes === digitCount ? 
        `정답입니다! ${attempts} 번 만에 맞히셨습니다.` :
        `${balls} 볼 ${strikes} 스트라이크`;

    resultMessage.textContent = resultText;
    if (strikes === digitCount) {
        submitButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
    } else {
        addHistory(userNumbers, `${balls} 볼 ${strikes} 스트라이크`);
    }
}

function resetGame() {
    resultMessage.textContent = '';
    tryCountDisplay.textContent = '시도횟수: 0';
    submitButton.classList.remove('hidden')
    restartButton.classList.add('hidden');
    updateInputGrid();
    attempts = 0;
    secretNumbers = generateSecretNumbers(parseInt(numberRangeSelect.value), parseInt(digitCountSelect.value));
    historyDisplay.innerHTML = ''; // 입력 기록 초기화
}

function openPopup() {
    rulesPopup.style.display = 'flex';
}

function closePopupHandler() {
    rulesPopup.style.display = 'none';
}

// Event Listeners
numberRangeSelect.addEventListener('change', updateInputGrid);
digitCountSelect.addEventListener('change', updateInputGrid);
submitButton.addEventListener('click', checkAnswer);
restartButton.addEventListener('click', resetGame);
ruleButton.addEventListener('click', openPopup);
closePopup.addEventListener('click', closePopupHandler);

// Initialize the game
resetGame();

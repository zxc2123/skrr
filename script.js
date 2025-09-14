let secretNumbers = [];
let attempts = 0;

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

// ✅ 기록 저장용 영역 동적으로 생성 (없으므로 추가)
const historyDisplay = document.createElement('div');
historyDisplay.id = 'historyDisplay';
historyDisplay.style.marginTop = '20px';
historyDisplay.style.fontSize = '16px';
document.querySelector('.container').appendChild(historyDisplay);

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
    const range = parseInt(numberRangeSelect.value);
    inputGrid.innerHTML = '';

    for (let i = 0; i < digitCount; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = range;
        input.required = true;
        input.classList.add('guess-input');
        inputGrid.appendChild(input);
    }
}

function checkAnswer() {
    const inputs = Array.from(inputGrid.getElementsByTagName('input'));
    const userNumbers = inputs.map(input => parseInt(input.value));
    const range = parseInt(numberRangeSelect.value);
    const digitCount = parseInt(digitCountSelect.value);

    // 유효성 검사
    if (userNumbers.includes(NaN) || userNumbers.length !== digitCount || new Set(userNumbers).size !== digitCount) {
        resultMessage.textContent = '모든 숫자를 정확히, 중복 없이 입력해주세요!';
        resultMessage.style.color = 'red';
        return;
    }

    let strikes = 0;
    let balls = 0;

    userNumbers.forEach((num, idx) => {
        if (num === secretNumbers[idx]) {
            strikes++;
        } else if (secretNumbers.includes(num)) {
            balls++;
        }
    });

    attempts++;
    tryCountDisplay.textContent = `시도횟수: ${attempts}`;

    const resultText = strikes === digitCount
        ? `🎉 정답입니다! ${attempts}번 만에 맞히셨습니다.`
        : `${balls} 볼 ${strikes} 스트라이크`;

    resultMessage.textContent = resultText;
    resultMessage.style.color = strikes === digitCount ? 'green' : 'black';

    if (strikes === digitCount) {
        submitButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
    }

    addHistory(userNumbers, resultText);
}

function addHistory(numbers, result) {
    const entry = document.createElement('div');
    entry.textContent = `${numbers.join(', ')} → ${result}`;
    historyDisplay.appendChild(entry);
}

function resetGame() {
    resultMessage.textContent = '';
    tryCountDisplay.textContent = '시도횟수: 0';
    submitButton.classList.remove('hidden');
    restartButton.classList.add('hidden');
    updateInputGrid();
    attempts = 0;
    const range = parseInt(numberRangeSelect.value);
    const count = parseInt(digitCountSelect.value);
    secretNumbers = generateSecretNumbers(range, count);
    historyDisplay.innerHTML = '';
}

// 팝업 열고 닫기
function openPopup() {
    rulesPopup.style.display = 'flex';
}
function closePopupHandler() {
    rulesPopup.style.display = 'none';
}

// 이벤트 바인딩
numberRangeSelect.addEventListener('change', resetGame);
digitCountSelect.addEventListener('change', resetGame);
submitButton.addEventListener('click', checkAnswer);
restartButton.addEventListener('click', resetGame);
ruleButton.addEventListener('click', openPopup);
closePopup.addEventListener('click', closePopupHandler);

// 초기화
resetGame();

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

// 기록 영역 생성
const historyDisplay = document.createElement('div');
historyDisplay.id = 'historyDisplay';
historyDisplay.style.marginTop = '20px';
historyDisplay.style.fontSize = '16px';
document.querySelector('.container').appendChild(historyDisplay);

// ✅ 랜덤 숫자 생성 함수
function generateSecretNumbers(range, count) {
    const numbers = Array.from({ length: range }, (_, i) => i + 1);
    const result = [];
    while (result.length < count) {
        const idx = Math.floor(Math.random() * numbers.length);
        result.push(numbers.splice(idx, 1)[0]);
    }
    return result;
}

// ✅ 입력창 생성
function updateInputGrid() {
    const count = parseInt(digitCountSelect.value);
    const max = parseInt(numberRangeSelect.value);
    inputGrid.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = max;
        input.required = true;
        input.classList.add('guess-input');
        inputGrid.appendChild(input);
    }
}

// ✅ 정답 체크
function checkAnswer() {
    const inputs = Array.from(inputGrid.getElementsByTagName('input'));
    const userNumbers = inputs.map(input => parseInt(input.value));

    // 입력 유효성 검사
    if (
        userNumbers.some(num => isNaN(num)) ||
        new Set(userNumbers).size !== userNumbers.length
    ) {
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

    const resultText = strikes === secretNumbers.length
        ? `🎉 정답입니다! ${attempts}번 만에 맞히셨습니다.`
        : `${balls} 볼 ${strikes} 스트라이크`;

    resultMessage.textContent = resultText;
    resultMessage.style.color = strikes === secretNumbers.length ? 'green' : 'black';

    if (strikes === secretNumbers.length) {
        submitButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
    }

    addHistory(userNumbers, resultText);
}

// ✅ 히스토리 출력
function addHistory(numbers, result) {
    const entry = document.createElement('div');
    entry.textContent = `${numbers.join(', ')} → ${result}`;
    historyDisplay.appendChild(entry);
}

// ✅ 게임 초기화
function resetGame() {
    const range = parseInt(numberRangeSelect.value);
    const count = parseInt(digitCountSelect.value);

    resultMessage.textContent = '';
    resultMessage.style.color = 'black';
    tryCountDisplay.textContent = '시도횟수: 0';
    attempts = 0;
    historyDisplay.innerHTML = '';

    submitButton.classList.remove('hidden');
    restartButton.classList.add('hidden');

    updateInputGrid();
    secretNumbers = generateSecretNumbers(range, count);

    console.log("🔐 Secret Numbers:", secretNumbers); // 디버깅용
}

// ✅ 팝업
function openPopup() {
    rulesPopup.style.display = 'flex';
}
function closePopupHandler() {
    rulesPopup.style.display = 'none';
}

// ✅ 이벤트 연결
numberRangeSelect.addEventListener('change', resetGame);
digitCountSelect.addEventListener('change', resetGame);
submitButton.addEventListener('click', checkAnswer);
restartButton.addEventListener('click', resetGame);
ruleButton.addEventListener('click', openPopup);
closePopup.addEventListener('click', closePopupHandler);

// ✅ 시작
resetGame();

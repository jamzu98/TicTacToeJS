// Player objects
function Player(mark) {
    this.mark = mark;
}

const PLAYER_PROMPT = document.querySelector('.player-prompt');
const PVP_BUTTON = document.querySelector('.pvp-btn');
const AI_BUTTON = document.querySelector('.ai-btn');
const END_SCREEN = document.querySelector('.end-screen');
const WINNER_TEXT = document.querySelector('.winner-text');
const RESTART_BUTTON = document.querySelector('.restart-btn');

const X_SCORE_TEXT = document.querySelector('.x-score');
const O_SCORE_TEXT = document.querySelector('.o-score');

const PLAYER1 = new Player('X');
const PLAYER2 = new Player('O');
const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let turnKeeper = 0; // 0 = X, 1 = O
let hasWinner = false;
let gameBoard;
let aiOn = false;
let xPoints = 0;
let oPoints = 0;

PVP_BUTTON.addEventListener('click', pvpGame);
AI_BUTTON.addEventListener('click', aiGame);


// Gameboard Array
function Gameboard() {
    this.gameBoardArray = Array.from(document.querySelectorAll('.cell'));
    this.gameBoardArray.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', cellClicked, {once: true});
    });
}

function pvpGame() {
    aiOn = false;
    startGame();
}

function aiGame() {
    aiOn = true;
    startGame();
}

// Game Start Function
function startGame() {
    X_SCORE_TEXT.textContent = "X: " + xPoints;
    O_SCORE_TEXT.textContent = "O: " +  oPoints;
    PLAYER_PROMPT.classList.remove('show');
    gameBoard = new Gameboard();
    turnKeeper = 0;
    hasWinner = false;
    END_SCREEN.classList.remove('show');
}

function endGame(draw) {
    END_SCREEN.classList.add('show');
    if(draw) {
        WINNER_TEXT.innerHTML = 'Draw!';
    } else{
        WINNER_TEXT.textContent = `${currentPlayer.mark} is the winner!`;
    }
    RESTART_BUTTON.addEventListener('click', restartGame);
}

function cellClicked() {
    // place mark on gameboard
    if (this.innerHTML == '' && !hasWinner) {
        this.innerHTML = turnKeeper == 0 ? PLAYER1.mark : PLAYER2.mark;
        shouldContinue();
    } else {
        alert('L2P');
    }
}

function shouldContinue() {
    if (checkWin()) {
        currentPlayer == PLAYER1 ? xPoints++ : oPoints++;
        console.log('winner');
        hasWinner = true;
        endGame(false);
    } else if (isDraw()) {
        hasWinner = true;
        endGame(true);
    }
    if(!hasWinner) {
        swapTurn();
        aiOn ? aiController() : null;
    }
}

function swapTurn() {
    turnKeeper == 0 ? turnKeeper = 1 : turnKeeper = 0;
}

function checkWin() {
    turnKeeper == 0 ? currentPlayer = PLAYER1 : currentPlayer = PLAYER2;
    return WINNING_COMBOS.some(combo => {
        return combo.every(index => {
            return gameBoard.gameBoardArray[index].innerHTML == currentPlayer.mark;
        });
    });
}

function isDraw() {
    return gameBoard.gameBoardArray.every(cell => {
        return cell.innerHTML != '';
    });
}

function restartGame() {
    startGame();
}

function calculateAiMove() {
    let emptySpace = 0;
    let oMarks = 0;
    let enemyWinning = 0;
    let moveHere;

    let enemyCounterMove;
    let ownWinMove;
    let needBlock = false;
    let oneToWin = false;

    // check for enemy marks
    for(let i = 0; i < WINNING_COMBOS.length; i++) {
        for(j = 0; j < WINNING_COMBOS[j].length; j++) {
            if(gameBoard.gameBoardArray[WINNING_COMBOS[i][j]].innerHTML == 'X') {
                enemyWinning++;
                console.log("enemyWinning: " + emptySpace);
            }
            if (enemyWinning >= 2) {
                for(let k = 0; k < WINNING_COMBOS[i].length; k++) {
                    if(gameBoard.gameBoardArray[WINNING_COMBOS[i][k]].innerHTML == '') {
                        enemyCounterMove = WINNING_COMBOS[i][k];
                        needBlock = true;
                    }
                }
            }
        }
        enemyWinning = 0;
    }
    // check if WINNING_COMBO pattern is empty or has an O on the gameboard
    for(let i = 0; i < WINNING_COMBOS.length; i++) {
        for(j = 0; j < WINNING_COMBOS[j].length; j++) {
            if(gameBoard.gameBoardArray[WINNING_COMBOS[i][j]].innerHTML != 'X') {
                emptySpace++;
                console.log("Winning move: " + emptySpace);
            }
            if (gameBoard.gameBoardArray[WINNING_COMBOS[i][j]].innerHTML == 'O') {
                oMarks++;
                console.log("oMarks: " + oMarks);
            }
            if (oMarks == 2) {
                for(let k = 0; k < WINNING_COMBOS[i].length; k++) {
                    if(gameBoard.gameBoardArray[WINNING_COMBOS[i][k]].innerHTML == '') {
                        ownWinMove= WINNING_COMBOS[i][k];
                        emptySpace = 0;
                        oMarks = 0;
                        oneToWin = true;
                    }
                }
            }
            else if (emptySpace === 3 && !oneToWin) {
                for(let k = 0; k < WINNING_COMBOS[i].length; k++) {
                    if(gameBoard.gameBoardArray[WINNING_COMBOS[i][k]].innerHTML == '') {
                        ownWinMove= WINNING_COMBOS[i][k];
                        emptySpace = 0;
                        oMarks = 0;
                    }
                }
            }
        }
        emptySpace = 0;
        oMarks = 0;
    }
    console.log(needBlock, oneToWin);
    return needBlock && !oneToWin ? moveHere = enemyCounterMove : moveHere = ownWinMove;
}

function aiController() {
    if (turnKeeper == 1) {
        let random = calculateAiMove();
        gameBoard.gameBoardArray[random].innerHTML = PLAYER2.mark;
        shouldContinue();
    }
 }


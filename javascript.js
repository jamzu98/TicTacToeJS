// Player objects
function Player(mark) {
    this.mark = mark;
}

const END_SCREEN = document.querySelector('.end-screen');
const WINNER_TEXT = document.querySelector('.winner-text');
const RESTART_BUTTON = document.querySelector('.restart-btn');

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

// Gameboard Array
function Gameboard() {
    this.gameBoardArray = Array.from(document.querySelectorAll('.cell'));
    this.gameBoardArray.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', cellClicked, {once: true});
    });
}

// Game Start Function
function startGame() {
    gameBoard = new Gameboard();
    console.log(gameBoard.gameBoardArray[0]);
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
    this.innerHTML = turnKeeper == 0 ? PLAYER1.mark : PLAYER2.mark;
    if (checkWin()) {
        console.log('winner');
        hasWinner = true;
        endGame(false);
    } else if (isDraw()) {
        hasWinner = true;
        endGame(true);
    }
    if(!hasWinner) {
        swapTurn();
        aiController();
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

function aiController() {
    if (turnKeeper == 1) {
        let randomCell = Math.floor(Math.random() * 9);
        if(gameBoard.gameBoardArray[randomCell].innerHTML == '') {
            gameBoard.gameBoardArray[randomCell].innerHTML = PLAYER2.mark;
            if (checkWin()) {
                hasWinner = true;
                endGame(false);
            } else if (isDraw()) {
                hasWinner = true;
                endGame(true);
            }
            if(!hasWinner) {
                swapTurn();
            }
        } else {
            aiController();
        }
    }
}

startGame();
const board = document.getElementById('board');
const status = document.getElementById('status');
const overlay = document.getElementById('overlay');
const resultElement = document.getElementById('result');
const resetButton = document.querySelector('.reset-button');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
let currentPlayer = 'X' ;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let isComputerGame = false;

function startGame() {
    const player1Name = player1Input.value || 'Player 1';
    const player2Name = player2Input.value.trim() ;

    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    isComputerGame = player2Name === '' ? true : false;

    status.textContent = `${player1Name}'s turn`;
    updateBoard();
    if (isComputerGame && currentPlayer === 'O') {
        setTimeout(computerMove, 1000);
    }
}

function handleCellClick(index) {
    if (gameBoard[index] === '' && gameActive && currentPlayer === 'X') {
        gameBoard[index] = currentPlayer;
        updateBoard();
        checkWinner();
        togglePlayer();
    } else if (!isComputerGame && gameBoard[index] === '' && gameActive && currentPlayer === 'O') {
        // Allow manual play for Player 2 (human) if not a computer game
        gameBoard[index] = currentPlayer;
        updateBoard();
        checkWinner();
        togglePlayer();
    }
}

function makeMove() {
    if (currentPlayer === 'O') {
        if (isComputerGame) {
            setTimeout(computerMove, 1000);
        } else {
            // Player 2 is human, wait for their move
            status.textContent = `${player2Input.value}'s turn`;
			
        }
    }
}

function computerMove() {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerChoice = emptyCells[randomIndex];

    gameBoard[computerChoice] = 'O';
    updateBoard();
    checkWinner();
    togglePlayer();
}

function updateBoard() {
    for (let i = 0; i < gameBoard.length; i++) {
        const cell = document.querySelector(`.cell[data-index="${i}"]`);
        cell.textContent = gameBoard[i];
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const player1Name = player1Input.value || 'Player 1';
    //const player2Name = player2Input.value.trim();
	const player2Name = player2Input.value || 'Computer';
	//const player2Name = player2Input.value.trim() === '' ? 'Computer' : player2Input.value;
    status.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s turn`;
    makeMove();
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            showResult(gameBoard[a]);
            break;
        }
    }

    if (!gameBoard.includes('') && gameActive) {
        showResult('Draw');
    }
}

function showResult(result) {
    if (result === 'Draw') {
        resultElement.textContent = 'It\'s a draw! Want to play again?';
    } else {
        const player1Name = player1Input.value || 'Player 1';
        const player2Name = player2Input.value.trim() === '' ? 'Computer' : player2Input.value;
        resultElement.textContent = `${result === 'X' ? player1Name : player2Name} wins! Want to play again?`;
    }
    overlay.style.display = 'flex';
    gameActive = false;
}

function resetGame() {
    //currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
	currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = false;
    status.textContent = '';
    overlay.style.display = 'none';
    updateBoard();
    startGame(); // Start a new game immediately
}

board.addEventListener('click', (e) => {
    const cellIndex = e.target.getAttribute('data-index');
    if (cellIndex !== null) {
        status.textContent = `Game is not started, Click on Start Game`;
		handleCellClick(cellIndex);
    }
});

resetButton.addEventListener('click', resetGame);

// Start a new game when the page loads
//startGame();

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const boardElement = document.getElementById("sudoku-board");
    const mainMenu = document.getElementById("main-menu");
    const gameScreen = document.getElementById("game-screen");
    
    // Buttons & UI
    const btnStartLevel = document.getElementById("btn-start-level");
    const btnStartFree = document.getElementById("btn-start-free");
    const btnBack = document.getElementById("btn-back");
    const btnCheck = document.getElementById("btn-check");
    const btnSolve = document.getElementById("btn-solve");
    const btnNextLevel = document.getElementById("btn-next-level");
    
    const displayMode = document.getElementById("display-mode");
    const displayTimer = document.getElementById("display-timer");
    const difficultySelect = document.getElementById("difficulty-select");

    // Game State
    let currentMode = 'free'; // 'level' or 'free'
    let currentLevel = 1;
    let currentDifficulty = 'medium';
    let timerInterval = null;
    let secondsElapsed = 0;

    // --- Core Logic ---

    function initializeBoard() {
        boardElement.innerHTML = ''; // Clear previous
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const input = document.createElement("input");
                input.type = "number";
                input.min = 1; input.max = 9;
                input.className = "cell";
                input.id = `cell-${row}-${col}`;
                if ((col + 1) % 3 === 0 && col !== 8) input.classList.add("border-right");
                if ((row + 1) % 3 === 0 && row !== 8) input.classList.add("border-bottom");
                boardElement.appendChild(input);
            }
        }
    }

    function getBoardState() {
        const board = [];
        for (let row = 0; row < 9; row++) {
            const currentRow = [];
            for (let col = 0; col < 9; col++) {
                const val = document.getElementById(`cell-${row}-${col}`).value;
                currentRow.push(val === "" ? 0 : parseInt(val));
            }
            board.push(currentRow);
        }
        return board;
    }

    function setBoardState(board, isGenerated = false) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                const val = board[row][col];
                if (val !== 0) {
                    cell.value = val;
                    if (isGenerated) {
                        cell.readOnly = true;
                        cell.classList.add("readonly");
                    }
                } else {
                    cell.value = "";
                    cell.readOnly = false;
                    cell.classList.remove("readonly");
                }
            }
        }
    }

    // --- Timer Logic ---

    function updateTimerDisplay() {
        const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
        const secs = String(secondsElapsed % 60).padStart(2, '0');
        displayTimer.textContent = `${mins}:${secs}`;
    }

    function startTimer() {
        clearInterval(timerInterval);
        secondsElapsed = 0;
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            secondsElapsed++;
            updateTimerDisplay();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // --- API Calls & Navigation ---

    async function loadPuzzle() {
        // Reset UI
        btnNextLevel.classList.add('hidden');
        btnCheck.disabled = false;
        
        let url = `/generate?mode=${currentMode}`;
        if (currentMode === 'level') {
            url += `&level=${currentLevel}`;
            displayMode.textContent = `Level ${currentLevel}`;
        } else {
            url += `&difficulty=${currentDifficulty}`;
            displayMode.textContent = `Practice: ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        document.querySelectorAll('.cell').forEach(c => {
            c.readOnly = false;
            c.classList.remove("readonly");
            c.value = "";
        });

        setBoardState(data.board, true);
        startTimer();
    }

    async function validateBoard() {
        const currentBoard = getBoardState();
        const res = await fetch("/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ board: currentBoard })
        });
        const data = await res.json();
        
        if (data.correct) {
            stopTimer();
            btnCheck.disabled = true;
            
            // Format time for alert
            const mins = Math.floor(secondsElapsed / 60);
            const secs = secondsElapsed % 60;
            const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
            
            alert(`Congratulations! You solved it in ${timeStr}!`);
            
            if (currentMode === 'level') {
                btnNextLevel.classList.remove('hidden');
            }
        } else {
            alert("Not quite right! Keep trying or check for empty cells.");
        }
    }

    async function solvePuzzle() {
        const currentBoard = getBoardState();
        const res = await fetch("/solve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ board: currentBoard })
        });
        const data = await res.json();
        if (res.ok) {
            setBoardState(data.board);
            stopTimer();
            displayTimer.textContent = "CHEAT";
            btnCheck.disabled = true;
        } else {
            alert("Could not solve. Ensure your manual inputs don't break Sudoku rules.");
        }
    }

    // --- Event Listeners ---

    btnStartLevel.addEventListener("click", () => {
        currentMode = 'level';
        mainMenu.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        loadPuzzle();
    });

    btnStartFree.addEventListener("click", () => {
        currentMode = 'free';
        currentDifficulty = difficultySelect.value;
        mainMenu.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        loadPuzzle();
    });

    btnBack.addEventListener("click", () => {
        stopTimer();
        gameScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    });

    btnNextLevel.addEventListener("click", () => {
        currentLevel++;
        loadPuzzle();
    });

    btnCheck.addEventListener("click", validateBoard);
    btnSolve.addEventListener("click", solvePuzzle);

    // Initialize Grid on load
    initializeBoard();
});

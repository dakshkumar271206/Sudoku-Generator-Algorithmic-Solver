document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("sudoku-board");
    const btnGenerate = document.getElementById("btn-generate");
    const btnSolve = document.getElementById("btn-solve");

    // 1. Build the 9x9 grid in the DOM
    function initializeBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const input = document.createElement("input");
                input.type = "number";
                input.min = 1;
                input.max = 9;
                input.className = "cell";
                input.id = `cell-${row}-${col}`;

                // Add thick borders for 3x3 visual blocks
                if ((col + 1) % 3 === 0 && col !== 8) input.classList.add("border-right");
                if ((row + 1) % 3 === 0 && row !== 8) input.classList.add("border-bottom");

                boardElement.appendChild(input);
            }
        }
    }

    // 2. Read the inputs and create a 2D Array
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

    // 3. Update the inputs from a 2D Array
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

    // 4. API Calls
    async function generatePuzzle() {
        const res = await fetch("/generate");
        const data = await res.json();
        
        // Reset DOM classes first
        document.querySelectorAll('.cell').forEach(c => {
            c.readOnly = false;
            c.classList.remove("readonly");
            c.value = "";
        });

        setBoardState(data.board, true);
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
        } else {
            alert(data.error || "Could not solve this board. Ensure your inputs are valid.");
        }
    }

    // Event Listeners
    btnGenerate.addEventListener("click", generatePuzzle);
    btnSolve.addEventListener("click", solvePuzzle);

    // Initialize UI and fetch the first puzzle
    initializeBoard();
    generatePuzzle();
});
import random
from .solver import solve

def generate_puzzle(difficulty=40):
    """Generates a new Sudoku board. 'difficulty' is the number of empty cells."""
    board = [[0] * 9 for _ in range(9)]
    
    # Fill the first row with randomized 1-9 to ensure unique puzzles
    first_row = list(range(1, 10))
    random.shuffle(first_row)
    board[0] = first_row
    
    # Solve the board to get a complete, valid Sudoku grid
    solve(board)
    
    # Remove numbers to create the puzzle
    cells_to_remove = difficulty
    while cells_to_remove > 0:
        row = random.randint(0, 8)
        col = random.randint(0, 8)
        
        if board[row][col] != 0:
            board[row][col] = 0
            cells_to_remove -= 1
            
    return board
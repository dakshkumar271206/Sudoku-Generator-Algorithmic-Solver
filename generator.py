import random
from .solver import solve

def generate_puzzle(empty_cells=40):
    board = [[0] * 9 for _ in range(9)]
    first_row = list(range(1, 10))
    random.shuffle(first_row)
    board[0] = first_row
    
    solve(board)
    
    # Cap maximum empty cells to ensure puzzles remain solvable
    cells_to_remove = min(empty_cells, 64)
    
    while cells_to_remove > 0:
        row = random.randint(0, 8)
        col = random.randint(0, 8)
        if board[row][col] != 0:
            board[row][col] = 0
            cells_to_remove -= 1
            
    return board

def find_empty(board):
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] == 0:
                return (i, j)
    return None

def is_valid(board, num, pos):
    row, col = pos
    for i in range(len(board[0])):
        if board[row][i] == num and col != i:
            return False
    for i in range(len(board)):
        if board[i][col] == num and row != i:
            return False
    box_x = col // 3
    box_y = row // 3
    for i in range(box_y * 3, box_y * 3 + 3):
        for j in range(box_x * 3, box_x * 3 + 3):
            if board[i][j] == num and (i, j) != pos:
                return False
    return True

def solve(board):
    find = find_empty(board)
    if not find:
        return True
    else:
        row, col = find

    for i in range(1, 10):
        if is_valid(board, i, (row, col)):
            board[row][col] = i
            if solve(board):
                return True
            board[row][col] = 0
    return False

def is_valid_completed_board(board):
    """Checks if the board is completely full and mathematically correct."""
    for row in board:
        if 0 in row: return False  # Incomplete
        
    for r in range(9):
        for c in range(9):
            num = board[r][c]
            board[r][c] = 0  # Temporarily remove to check valid placement
            if not is_valid(board, num, (r, c)):
                board[r][c] = num
                return False
            board[r][c] = num
    return True

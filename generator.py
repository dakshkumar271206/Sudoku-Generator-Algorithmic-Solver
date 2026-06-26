from flask import Flask, render_template, request, jsonify
from backend.solver import solve, is_valid_completed_board
from backend.generator import generate_puzzle

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['GET'])
def generate():
    mode = request.args.get('mode', 'free')
    
    if mode == 'level':
        level = int(request.args.get('level', 1))
        # Base of 30 empty cells, add 2 for each level
        empty_cells = 30 + (level * 2) 
    else:
        # Free mode handling
        diff = request.args.get('difficulty', 'medium')
        if diff == 'easy': empty_cells = 35
        elif diff == 'medium': empty_cells = 45
        elif diff == 'hard': empty_cells = 55
        elif diff == 'expert': empty_cells = 62
        else: empty_cells = 45

    board = generate_puzzle(empty_cells=empty_cells)
    return jsonify({'board': board})

@app.route('/solve', methods=['POST'])
def solve_board():
    data = request.get_json()
    board = data.get('board')
    if solve(board):
        return jsonify({'board': board, 'status': 'success'})
    return jsonify({'error': 'Unsolvable board configuration'}), 400

@app.route('/validate', methods=['POST'])
def validate():
    data = request.get_json()
    board = data.get('board')
    is_correct = is_valid_completed_board(board)
    return jsonify({'correct': is_correct})

if __name__ == '__main__':
    app.run(debug=True)

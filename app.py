from flask import Flask, render_template, request, jsonify
from backend.solver import solve
from backend.generator import generate_puzzle

app = Flask(__name__)

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/generate', methods=['GET'])
def generate():
    """API endpoint to get a fresh puzzle."""
    # 45 empty cells is roughly 'Medium' difficulty
    board = generate_puzzle(difficulty=45) 
    return jsonify({'board': board})

@app.route('/solve', methods=['POST'])
def solve_board():
    """API endpoint to solve the current board state."""
    data = request.get_json()
    board = data.get('board')
    
    if not board:
        return jsonify({'error': 'No board data provided'}), 400

    # Solve mutates the board list in-place
    success = solve(board)
    
    if success:
        return jsonify({'board': board, 'status': 'success'})
    else:
        return jsonify({'error': 'Unsolvable board configuration'}), 400

if __name__ == '__main__':
    app.run(debug=True)
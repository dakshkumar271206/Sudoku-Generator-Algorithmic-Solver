Python Sudoku Master 🧩
Sudoku Master is a full-stack, web-based Sudoku game powered by a robust Python backtracking algorithm. It features a clean, responsive UI and offers both a progressive campaign mode and a customizable free-play sandbox.

The project strictly separates concerns, using a lightweight Flask API for the heavy computational logic (puzzle generation and solving) and Vanilla JavaScript with CSS Grid for a snappy, interactive frontend.

✨ Key Features
Campaign (Level) Mode: Progress through an endless series of puzzles that automatically increase in difficulty as you advance through the levels.

Free Play Mode: Practice your skills by selecting a specific difficulty tier: Easy, Medium, Hard, or Expert.

Live Timer & HUD: Track your solving speed in real-time with a built-in Heads Up Display to measure your improvement.

Smart Validation: The game doesn't just check if the board is full; it mathematically verifies your inputs against Sudoku rules to ensure a genuine win.

Algorithmic Auto-Solver: Stuck on a puzzle? The built-in "Solve For Me" cheat utilizes a highly optimized Python depth-first search (Backtracking) algorithm to solve any valid board in milliseconds.

Infinite Unique Puzzles: Instead of using a static database of pre-made games, the Python backend dynamically generates a brand-new, mathematically unique puzzle every single time you play.

🛠️ Tech Stack
Backend: Python 3, Flask (API routing)

Game Engine: Custom Python modules (solver.py, generator.py)

Frontend: HTML5, CSS3 (CSS Grid architecture), Vanilla JavaScript (DOM manipulation & Fetch API)

Architecture: RESTful API design exchanging JSON payloads.

🚀 How to Run Locally
Ensure you have Python 3 installed.

Clone this repository and navigate to the project folder:

Bash
cd sudoku_project
Install the required dependencies:

Bash
pip install flask
Start the local server:

Bash
python app.py
Open your web browser and go to http://127.0.0.1:5000 to play!

# 🧩 8-Puzzle: A* AI Solver

A classic 8-puzzle game built for an **Artificial Intelligence** course assignment. Players must slide tiles 1–8 into sequential order, featuring a built-in bot that provides optimal hints or automatically solves the puzzle using the **A* Search** algorithm.

## 🚀 Demo

* Open `index.html` in your browser.
* ![Status](https://img.shields.io/badge/status-playable-brightgreen)

## ✨ Features

* **Interactive 3x3 Board:** Click any tile adjacent to the empty square to slide it.
* **Smart Shuffle:** Randomizes the board using a short 14–16 step random walk to ensure the optimal solution remains under 20 moves.
* **AI Hint:** The bot runs an A* search from the current position and highlights the best tile to move next.
* **Auto-Solve:** The bot executes the entire optimal solution automatically, step-by-step.
* **Live Stats:** Features a move counter and tracks the minimum optimal steps required for completion.

## 🧠 Algorithm: A* Search

The hint and auto-solve bot is powered by **A* Search**:

* **g(n):** The total number of steps taken from the initial starting position.
* **h(n):** The **Manhattan Distance** heuristic, which calculates the total grid distance (rows + columns) of every tile from its target position.
* **f(n) = g(n) + h(n):** The evaluation function that determines the priority of node exploration.

Because the Manhattan Distance is an *admissible* heuristic (it never overestimates the actual cost), this A* implementation mathematically guarantees finding a solution with the absolute minimum number of steps. The priority queue is implemented as a binary min-heap to maintain high search efficiency.

## 📁 Project Structure

* `index.html`: Page structure.
* `style.css`: Visual styling.
* `script.js`: Game logic and A* solver.

## 🛠️ How to Run

This project requires zero installation or external servers; it runs directly in the browser:

1. `git clone https://github.com/elikawicaksana/8-Puzzle-Game.git`
2. `cd 8-Puzzle-Game`
3. `open index.html` (or simply double-click the `index.html` file).

## 💻 Technology Stack

* Pure HTML, CSS, and Vanilla JavaScript (Zero external frameworks or dependencies).
* Fonts: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) & [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts.

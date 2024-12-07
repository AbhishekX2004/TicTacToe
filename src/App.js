import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [winner, setWinner] = useState(null);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (newBoard) => {
    for (const [a, b, c] of winningCombinations) {
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    return newBoard.every((square) => square !== null) ? "Draw" : null;
  };

  const minimax = (newBoard, depth, isMaximizing) => {
    const result = checkWinner(newBoard);
    if (result === "X") return -10 + depth;
    if (result === "O") return 10 - depth;
    if (result === "Draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = "O";
          let score = minimax(newBoard, depth + 1, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = "X";
          let score = minimax(newBoard, depth + 1, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const findBestMove = () => {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const handleClick = (index) => {
    if (!board[index] && !winner && !isComputerTurn) {
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      const result = checkWinner(newBoard);
      setWinner(result);
      setIsComputerTurn(true);
    }
  };

  useEffect(() => {
    if (isComputerTurn && !winner) {
      const computerMove = findBestMove();
      const newBoard = [...board];
      newBoard[computerMove] = "O";
      setBoard(newBoard);
      const result = checkWinner(newBoard);
      setWinner(result);
      setIsComputerTurn(false);
    }
  }, [isComputerTurn, winner, board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsComputerTurn(false);
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="board">
        {board.map((square, index) => (
          <button
            key={index}
            className="square"
            onClick={() => handleClick(index)}
            disabled={square || winner || isComputerTurn}
          >
            {square}
          </button>
        ))}
      </div>
      {winner && (
        <div className="result">
          {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;

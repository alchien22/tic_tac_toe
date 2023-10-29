//Import useState so that component calls are remembered
import { useState } from "react";

//Introduce modularity by making square into a function rather than repeating code
//Argument/prop can be added so square numbers can be different
//function Square({value}) {}
function Square({ value, onSquareClick }) {
  //value stores value and setValue can change value (start as null)
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

//Component: JS function that returns a button that displays X as its text
//Components can only return 1 JSX element
//For multiple, use framents to wrap
//To separate elements on different lines, must group components using divs with styles from className=board-row

function Board({ xIsNext, squares, onPlay }) {
  //Add nested component for response when a square is clicked
  function handleClick(i) {
    //Check if current square is already filled or game won: if so, return early to prevent edit
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    //Creates copy of squares array with slice() method
    //Copy of squares data is created instead of directly mutating squares array
    //Benefits: easier implementation of various features and typically all child components re-render when the
    //...parent component changes (affects performance)
    const nextSquares = squares.slice();
    //Alternate X and O turns
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //Determine if there's a winner after current move
  //Create winner statement
  //Otherwise, create statement for next player turn
  const winner = calculateWinner(squares);
  //status will display text
  let status;
  if (winner) {
    status = "winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  //can't just do onSquareClick={handleClick(0)} because it will alter the state of the board component and
  //...will re-render the board, triggering the same function again, leading to infinite loop
  //() =>: arrow fuction (function after arrow will run after square is clicked)
  //Don't want function to be run until the user licks
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

//export default function: Game() is top-level component
export default function Game() {
  //Create history array to allow for restoring previous states
  const [history, setHistory] = useState([Array(9).fill(null)]);
  //Create new state variable to handle the current state of the board
  const [currentMove, setCurrentmove] = useState(0);
  //Render selected move instead of the final move
  const currentSquares = history[currentMove];
  //X's move when turn is even
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    //Just add next move to history.slice(0, currentMove+1) to focus on new timeline
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    //Update current move to latest history entry
    setCurrentmove(nextHistory.length - 1);
  }

  //We will be using map to transform array of react elements to another
  function jumpTo(nextMove) {
    setCurrentmove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      //On click, jumpTo is called and previous version is restored. Displays move number next to button.
      //Create a unique key for each move button (use whenever building dynamic lists) to help React keep
      //track of each component (list element)
      //Keys don't need to be globally unique but have to be unique between components and their siblings
      //Use the move number as the key
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div classname="game">
      <div classname="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <dic classname="game-info">
        <ol>{moves}</ol>
      </dic>
    </div>
  );
}

function calculateWinner(squares) {
  //Possible winning positions
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //Check if Xs or Os are 3 in a row
    //Return the team (X or O) that wins
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

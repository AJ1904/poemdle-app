import React, { useEffect } from "react";
import useWordle from "../hooks/useWordle"; // Importing the useWordle custom hook
import Grid from "./grid"; // Importing the Grid component
import Keyboard from "./keyboard"; // Importing the Keyboard component
import letters from "../data/letters"; // Importing the letters data
import Button from 'react-bootstrap/Button'; // Importing Button component from react-bootstrap

// Wordle component
const Wordle = ({ solution, lengthOfWord, updateGuessedWords, correctscore, totalHintsUsed, hints_enabled, score_tracking }) => {
    // Destructuring values from useWordle hook
    const {
        currentGuess,
        setCurrentGuess,
        turn,
        guesses,
        isCorrect,
        handleKeyUp,
        errorMsg,
        setErrorMsg,
        usedKeys,
        revealedHints,
        revealHint,
    } = useWordle(solution, lengthOfWord, updateGuessedWords, correctscore , totalHintsUsed);

    // Effect to handle keyup event
    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        if (isCorrect || turn > lengthOfWord+1) {
            window.removeEventListener("keyup", handleKeyUp);
        }
        return () => window.removeEventListener("keyup", handleKeyUp);
    }, [handleKeyUp, isCorrect, turn, lengthOfWord]);

    // JSX
    return (
        <div className="main">
            {/* Hint button and moves count */}
            {hints_enabled && (
            <div className="button-container">
            {revealedHints.length > 0 && (
                <div className="hint-message">
                    Try "{revealedHints[revealedHints.length - 1].toUpperCase()}".
                </div>
            )}
            <Button variant="warning" onClick={revealHint} disabled={revealedHints.length >= lengthOfWord}>Hint</Button>{' '}
            <div className="moves">Moves: {turn}/{lengthOfWord+1}</div>
            </div>
            )}
            {/* Rendering Grid component */}
            <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} lengthOfWord={lengthOfWord}/>
            {/* Error message display */}
            {errorMsg && (
                <div className="error">
                    <p>{errorMsg}</p>
                </div>
            )}
            {/* Rendering Keyboard component */}
            <Keyboard letters={letters} usedKeys={usedKeys} />
        </div>
    );
};

export default Wordle;

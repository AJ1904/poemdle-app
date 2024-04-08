import React from "react";
import Row from "./row"; // Importing the Row component

// Grid component
const Grid = ({ guesses, currentGuess, turn, lengthOfWord }) => {
    return (
        <div className="grid">
            {/* Mapping through guesses */}
            {guesses.map((guess, i) => {
                // Rendering the Row component for the current turn
                if (turn === i)
                    return <Row key={i} currentGuess={currentGuess} lengthOfWord={lengthOfWord}/>;
                // Rendering the Row component for previous turns
                return <Row key={i} guess={guess} lengthOfWord={lengthOfWord}/>;
            })}
        </div>
    );
};

export default Grid;

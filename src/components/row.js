import React from "react";

// Row component
const Row = ({ guess, currentGuess, lengthOfWord }) => {
    // Rendering for past guesses
    if (guess) {
        return (
            <div className="row past">
                {/* Mapping through guess array */}
                {guess.map((l, i) => (
                    <div key={i} className={l.color}>
                        {l.key}
                    </div>
                ))}
            </div>
        );
    }

    // Rendering for current guess
    if (currentGuess) {
        let letters = currentGuess.split("");
        return (
            <div className="row current">
                {/* Mapping through letters in current guess */}
                {letters.map((letter, i) => (
                    <div key={i} className="filled">
                        {letter}
                    </div>
                ))}
                {/* Adding placeholders for remaining letters */}
                {[...Array(lengthOfWord - currentGuess.length)].map((_, i) => (
                    <div key={i}></div>
                ))}
            </div>
        );
    }

    // Rendering for empty row (no guess yet)
    return (
        <div className="row">
            {/* Adding placeholders for all letters */}
            {[...Array(lengthOfWord)].map((_, i) => (
                <div key={i}></div>
            ))}           
        </div>
    );
};

export default Row;

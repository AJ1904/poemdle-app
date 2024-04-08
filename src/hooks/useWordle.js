import { useState } from "react";
import axios from "axios";

const useWordle = (solution, lengthOfWord, updateGuessedWords, correctscore, totalHintsUsed) => {
    // State variables for managing game state
    const [turn, setTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState("");
    const [guesses, setGuesses] = useState([...Array(lengthOfWord + 1)]);
    const [wordHistory, setWordHistory] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [usedKeys, setUsedKeys] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const [guessedWords, setGuessedWords] = useState({}); // State for guessed words
    const [revealedHints, setRevealedHints] = useState([]); // State to keep track of revealed hints
    const [isWordValid, setIsWordValid] = useState(true); // State to track if the guessed word is valid

    // Function to reset the game state
    const resetGame = () => {
        setTurn(0);
        setCurrentGuess("");
        setGuesses([...Array(lengthOfWord + 1)]);
        setWordHistory([]);
        setIsCorrect(false);
        setErrorMsg("");
        setGuessedWords({});
    };

    // Function to format the current guess for display
    const formatGuess = () => {
        let solutionArray = [...solution];

        let formattedGuess = [...currentGuess].map(l => {
            return { key: l, color: "grey" };
        });

        formattedGuess.forEach((l, i) => {
            if (solutionArray[i] === l.key) {
                solutionArray[i] = null;
                formattedGuess[i].color = "green";
            }
        });

        formattedGuess.forEach((l, i) => {
            if (solutionArray.includes(l.key) && l.color !== "green") {
                solutionArray[solutionArray.indexOf(l.key)] = null;
                formattedGuess[i].color = "yellow";
            }
        });
        return formattedGuess;
    };

    // Function to add a new guess to the game state
    const addNewGuess = formattedGuess => {
        if (currentGuess === solution) {
            // Delay the closing of the popup to show the animation
            setTimeout(() => {
                setIsCorrect(true);
                correctscore();
                // Update guessedWords when guess is correct
                updateGuessedWords(prevGuessedWords => ({
                    ...prevGuessedWords,
                    [currentGuess]: currentGuess
                }));
            }, 2000); // Adjust the delay time as needed
        }

        setGuesses(prevGuesses => {
            let guesses = [...prevGuesses];
            guesses[turn] = formattedGuess;
            return guesses;
        });

        setWordHistory(history => [...history, currentGuess]);
        

        setUsedKeys(prevUsedKeys => {
            formattedGuess.forEach(l => {
                let currentColor = prevUsedKeys[l.key];
                let keyColor = l.color;

                if (keyColor === "green") {
                    prevUsedKeys[l.key] = "green";
                    return;
                }

                if (keyColor === "yellow" && currentColor !== "green") {
                    prevUsedKeys[l.key] = "yellow";
                    return;
                }

                if (
                    keyColor === "grey" &&
                    currentColor !== ("green" || "yellow")
                ) {
                    prevUsedKeys[l.key] = "grey";
                    return;
                }
            });

            return prevUsedKeys;
        });
        setErrorMsg("");
        setCurrentGuess("");
    };

    // Function to handle key up events
    const handleKeyUp = async ({ key }) => {
        if (key === "Enter") {
            // Check various conditions before adding a new guess
            if (turn > lengthOfWord+1) {
                setErrorMsg("You've used all your guesses!!");
                console.log("you used all your guesses!");
                return;
            }
            if (wordHistory.includes(currentGuess)) {
                setErrorMsg("You've already tried that word!!");
                console.log("you already tried that word.");
                return;
            }
            if (currentGuess.length < lengthOfWord) {
                setErrorMsg("Word Incomplete!!");
                console.log("word must be {lengthOfWord} chars.");
                return;
            }
            // Validate the guessed word using the API
            try {
                await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess}`);
                setIsWordValid(true); // Set isWordValid to true if the word is valid
                addNewGuess(formatGuess());
                setTurn(prevTurn => prevTurn + 1);
            } catch (error) {
                if (currentGuess === solution){
                    setIsWordValid(true);
                    addNewGuess(formatGuess());
                    setTurn(prevTurn => prevTurn + 1);
                }
                else{
                    setIsWordValid(false); // Set isWordValid to false if the word is invalid
                    setErrorMsg("Invalid word!"); // Set error message for invalid word
                }
                return;
            }
        }
        if (key === "Backspace") {
            setErrorMsg("");
            setCurrentGuess(prev => prev.slice(0, -1));
            return;
        }
        if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < lengthOfWord) {
                setCurrentGuess(prev => prev + key.toLowerCase());
            }
        }
    };

    // Function to reveal a hint
    const revealHint = () => {
        totalHintsUsed();
        // Find the next character to reveal as a hint
        const remainingCharacters = solution.split("").filter(char => !revealedHints.includes(char));
        if (remainingCharacters.length > 0) {
            const nextCharacter = remainingCharacters[0];
            setRevealedHints([...revealedHints, nextCharacter]);
        }
    };

    // Return the necessary variables and functions for the Wordle component
    return {
        currentGuess,
        setCurrentGuess,
        turn,
        guesses,
        isCorrect,
        handleKeyUp,
        errorMsg,
        setErrorMsg,
        resetGame,
        usedKeys,
        guessedWords, // Include guessedWords in the return object
        revealedHints,
        revealHint,
        isWordValid,
        totalHintsUsed,
    };
};

export default useWordle;

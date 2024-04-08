import React from 'react';
import { useEffect, useState } from "react";
import Wordle from "./components/wordle";
import "./App.css";
import Footer from "./components/footer";
import { useFlags } from 'flagsmith/react';
import Container from 'react-bootstrap/Container';
import CloseButton from 'react-bootstrap/CloseButton';
import Row from 'react-bootstrap/Row';
import Popup from 'reactjs-popup';

// Home component
const Home = ({ poemsdictionary, daily, onPracticeClick }) => {
    // State declarations
    // Solution state: stores the solution for the Wordle game
    const [solution, setSolution] = useState(() => {
        if (daily) {
        const storedSolution = localStorage.getItem('solution');
        return storedSolution && daily ? JSON.parse(storedSolution) : [];
        }
        return [];
    });
    // Guessed words state: stores the guessed words in the Wordle game
    const [guessedWords, setGuessedWords] = useState(() => {
        if (daily) {
            const storedGuessedWords = localStorage.getItem('guessedWords');
            return storedGuessedWords && daily ? JSON.parse(storedGuessedWords) : {};
        }
        return {};
    });
    // Index of clicked word state: stores the index of the clicked word
    const [clickedWordIndex, setClickedWordIndex] = useState(null);
    // Score state: stores the score of the Wordle game
    const [score, setScore] = useState(() => {
        const storedScore = localStorage.getItem('score');
        console.log("Stored score:line 27 ", storedScore);
        return storedScore && daily ? JSON.parse(storedScore) : { correct: 0, total: 0 };
    });

    // Random poem key state: stores the key of the random poem
    const [randomPoemKey, setRandomPoemKey] = useState(() => {
        const storedPoemKey = localStorage.getItem('poemKey');
        return storedPoemKey && daily ? storedPoemKey : "";
    });

    // Solution modal visibility state
    const [showSolutionModal, setShowSolutionModal] = useState(false);
    // Total hints used state: stores the total hints used in the Wordle game
    const [totalHintsUsed, setTotalHintsUsed] = useState(() => {
        const storedHintsCount = localStorage.getItem('hintsUsed');
        return storedHintsCount && daily ? JSON.parse(storedHintsCount) : 0;
    });
    // Time until next day state: stores the time until the next day for daily challenges
    const [timeToNextDay, setTimeToNextDay] = useState(null);
    
    // Feature flags
    const { hints } = useFlags(['hints']);
    const { score_tracking } = useFlags(['score_tracking']);
    const { footer } = useFlags(['footer']);

    // Effect to calculate time until the next day for daily challenges
    useEffect(() => {
        if (daily) {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const timeUntilNextDay = tomorrow.getTime() - now.getTime();
            setTimeToNextDay(timeUntilNextDay);
        }
    }, [daily]);

    // Function to format time left
    const formatTimeLeft = (milliseconds) => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.ceil((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} hours and ${minutes} minutes`;
    };

    // Effect to initialize or retrieve guessed words from local storage
    useEffect(() => {
        const storedGuessedWords = localStorage.getItem('guessedWords');
        if (storedGuessedWords && Object.keys(JSON.parse(storedGuessedWords)).length > 0 && daily) {
            setGuessedWords(JSON.parse(storedGuessedWords));
        }
        else {
            const initialGuessedWords = {};
            let totalWordsCount = 0;
            solution.forEach(line => {
                line.forEach(item => {
                    if (/\b\w+\b/.test(item)) {
                        if (!(item in initialGuessedWords)) {
                            initialGuessedWords[item] = '';
                            totalWordsCount++;
                        }
                    } else {
                        initialGuessedWords[item] = item;
                    }
                });
            });
            if (daily) {
                localStorage.setItem('guessedWords', JSON.stringify(initialGuessedWords));
            }
            setGuessedWords(initialGuessedWords);
            setScore(prevScore => ({
                ...prevScore,
                total: totalWordsCount
            }));
        }
    }, [daily, solution]);

    // Effect to update guessed words in local storage
    useEffect(() => {
        if (daily) {
            localStorage.setItem('guessedWords', JSON.stringify(guessedWords));
        }
    }, [guessedWords, daily]);

    // Effect to initialize or retrieve solution from local storage
    useEffect(() => {
        const storedSolution = localStorage.getItem('solution');
        const storedPoemKey = localStorage.getItem('poemKey');
        if (daily && storedSolution && storedSolution.length > 0 && storedPoemKey) {
            setSolution(JSON.parse(storedSolution));
            setRandomPoemKey(storedPoemKey);
        } else {
            const poemKeys = Object.keys(poemsdictionary);
            const numberOfPoems = poemKeys.length;
            let randomIndex = Math.floor(Math.random() * numberOfPoems);
            const randomPoemKey = poemKeys[randomIndex];
            setRandomPoemKey(randomPoemKey);
            const randomPoem = poemsdictionary[randomPoemKey].toLowerCase();
            const lines = randomPoem.split('\n');
            const solution = lines.map(line => line.match(/(\b\w+\b|[^\w\s])/g));
            setSolution(solution);
            if (daily) {
                localStorage.setItem('solution', JSON.stringify(solution));
            }
        }
    }, [daily]);

    // Effect to initialize or retrieve score from local storage
    useEffect(() => {
        const storedScore = localStorage.getItem('score');
        if (storedScore && daily) {
            setScore(JSON.parse(storedScore));
        } else {
            const totalWordsCount = Object.keys(guessedWords).length;
            console.log("Total words count: ", totalWordsCount);
            setScore({ correct: 0, total: totalWordsCount });
            if (daily) {
                localStorage.setItem('score', JSON.stringify({ correct: 0, total: totalWordsCount }));
            }
        }
    }, [daily]);

    // Effect to initialize or retrieve totalHintsUsed from local storage
    useEffect(() => {
        const storedHintsCount = localStorage.getItem('hintsUsed');
        if (storedHintsCount && daily) {
            setTotalHintsUsed(JSON.parse(storedHintsCount));
        } else {
            setTotalHintsUsed(0);
            if (daily) {
                localStorage.setItem('hintsUsed', JSON.stringify(0));
            }
        }
    }, [daily]);

    // Effect to update score in local storage
    useEffect(() => {
        if (daily) {
            localStorage.setItem('score', JSON.stringify(score));
        }
    }, [score, daily]);

    // Effect to update totalHintsUsed in local storage
    useEffect(() => {
        if (daily) {
            localStorage.setItem('hintsUsed', JSON.stringify(totalHintsUsed));
        }
    }, [totalHintsUsed, daily]);

    // Function to update guessed words
    const updateGuessedWords = newGuessedWords => {
        setGuessedWords(newGuessedWords);
    };

    // Function to update score
    const updateScore = () => {
        setScore(prevScore => ({
            ...prevScore,
            correct: prevScore.correct + 1
        }));
    };

    // Function to update total hints used
    const updateHints = () => {
        setTotalHintsUsed(totalHintsUsed + 1);
    };

    // Function to handle word click
    const handleWordClick = (word, lineIndex, wordIndex) => {
        setClickedWordIndex([lineIndex, wordIndex]);
    };

    // Function to handle guess
    const handleGuess = (word, guess) => {
        const isCorrectGuess = (guess === word);
        if (isCorrectGuess) {
            setGuessedWords(prevState => ({
                ...prevState,
                [word]: guess
            }));
            updateScore();
        }
    };

    // Score text
    const scoreText = `${score.correct} / ${score.total}`;

    // Function to handle practice click
    const handlePracticeClick = () => {
        onPracticeClick();
    };

    // Function to close modal
    const closeModal = () => {
        setShowSolutionModal(false);
    };

    // Effect to show solution modal when all words are guessed
    useEffect(() => {
        const allWordsGuessed = solution.every(line => {
            return line.every(word => guessedWords[word] !== '');
        });

        if (allWordsGuessed && solution.length > 0) {
            setShowSolutionModal(true);
        }
        else {
            setShowSolutionModal(false);
        }
    }, [guessedWords, solution]);

    // Effect to clear solution modal when component unmounts
    useEffect(() => {
        return () => {
            setShowSolutionModal(false);
        };
    }, []);

    // Function to start a new game
    const startNewGame = () => {
        resetGame();
        closeModal();
    };

    // Function to reset game
    const resetGame = () => {
        const initialGuessedWords = {};
        solution.forEach(line => {
            line.forEach(item => {
                if (/\b\w+\b/.test(item)) {
                    initialGuessedWords[item] = '';
                } else {
                    initialGuessedWords[item] = item;
                }
            });
        });

        setScore({ correct: 0, total: Object.keys(initialGuessedWords).length });
        setGuessedWords(initialGuessedWords);
        setClickedWordIndex(null);
        setShowSolutionModal(false);
        setTotalHintsUsed(0);
        localStorage.clear();
    };

    // Return JSX
    return (
        <div className="App">
            <Container fluid>
                <Row>&nbsp;</Row>
                <Row>&nbsp;</Row>
                <Row>
                    <h3>🆃🅾🅿🅸🅲: <span style={{ textTransform: 'capitalize' }}>{randomPoemKey.charAt(0).toUpperCase() + randomPoemKey.slice(1).toLowerCase()} </span> </h3>
                </Row>
                <Row>
                    {score_tracking.enabled && <h4> <span> 🆂🅲🅾🆁🅴: {scoreText} </span> </h4>}
                </Row>
                <Row>
                    {hints.enabled && <h4> <span> 🅷🅸🅽🆃🆂 🆄🆂🅴🅳: {totalHintsUsed}</span> </h4>}
                </Row>
                <div className="word-rows">
                    {solution && solution.map((line, lineIndex) => (
                        <div key={lineIndex} className="word-line">
                            {line.map((word, wordIndex) => (
                                <span
                                    key={wordIndex}
                                    className={`word-box${guessedWords[word] !== '' ? ' guessed-word' : ''}`}
                                    onClick={() => handleWordClick(word, lineIndex, wordIndex)}
                                    title={`${word.length} letters`}
                                >
                                    <span className="letter-count">{word.length}</span>
                                    {guessedWords[word] && guessedWords[word] !== '' ? guessedWords[word].toUpperCase() : '\u00A0'.repeat(word.length)}
                                    {wordIndex !== line.length - 1 && ' '} {/* Add space between words */}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>

                <Popup
                    open={clickedWordIndex !== null && guessedWords[solution[clickedWordIndex[0]][clickedWordIndex[1]]] === ''}
                    onClose={() => setClickedWordIndex(null)}
                    modal
                >
                    {clickedWordIndex !== null && (
                        close => (
                            <div className="modal" onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                }
                            }}>
                                <div className="content">
                                    <CloseButton onClick={close} />
                                    <Wordle
                                        solution={solution[clickedWordIndex[0]][clickedWordIndex[1]]}
                                        lengthOfWord={solution[clickedWordIndex[0]][clickedWordIndex[1]].length}
                                        updateGuessedWords={updateGuessedWords}
                                        correctscore={updateScore}
                                        onGuess={(guess) => handleGuess(solution[clickedWordIndex[0]][clickedWordIndex[1]], guess)}
                                        totalHintsUsed={updateHints}
                                        hints_enabled={hints.enabled}
                                        score_tracking={score_tracking.enabled}
                                    />
                                </div>
                            </div>
                        )
                    )}
                </Popup>
                {showSolutionModal &&
                    <Popup
                        open={showSolutionModal}
                        onClose={closeModal}
                        modal
                        nested
                        className="custom-popup"
                        overlayClassName="custom-overlay"
                    >
                        <div className="modal">
                            <Container>
                                <h1>Woohooo!</h1>
                                <h2>You nailed it!</h2>
                                
                                {solution.map((line, lineIndex) => (
                                    <div key={lineIndex}>
                                        {line.map((word, wordIndex) => (
                                            <span key={wordIndex} className="poem-word">
                                                
                                                {guessedWords[word] !== '' ? guessedWords[word].charAt(0).toUpperCase() + guessedWords[word].slice(1).toLowerCase() : '\u00A0'.repeat(word.length)}
                                                {wordIndex !== line.length - 1 && ' '}
                                            </span>
                                        ))}
                                        <br />
                                    </div>
                                ))}
                                
                                <Row>
                                <button className="reset" onClick={closeModal}>Close</button>

                                {daily && timeToNextDay !== null && (
                                    <>
                                        <button className="reset green" onClick={handlePracticeClick}>Practice</button>
                                        <h4>{`Next in ${formatTimeLeft(timeToNextDay)}`}</h4>
                                    </>
                                )}


                                {!daily && <button className="reset green" onClick={startNewGame}>Start New Game</button>}
                                </Row>
                                </Container>
                            </div>
                        
                    </Popup>
                }
                {footer.enabled && <Footer />}
            </Container>
        </div>
    )
}

export default Home;

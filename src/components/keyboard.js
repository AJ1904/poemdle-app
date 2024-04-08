import React, { useEffect } from "react";
import { IoBackspaceOutline } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Keyboard component
const Keyboard = ({ letters, usedKeys }) => {
    // Function to handle button click
    const handleBtnClick = key => {
        // Dispatching keyup event
        window.dispatchEvent(
            new KeyboardEvent("keyup", {
                key,
            })
        );
    };

    // Effect to monitor usedKeys change
    useEffect(() => { }, [usedKeys]);

    // JSX
    return (
        <div className="keyboard">
            {/* Mapping through rows of letters */}
            {letters.map((row, i) => (
                <div className="row" key={i}>
                    {/* Mapping through letters in each row */}
                    {row.map((l, i) => (
                        <div
                            key={i}
                            onClick={() => handleBtnClick(l)} // Handling click event
                            className={usedKeys[l]} // Adding class based on usedKeys
                        >
                            {l}
                        </div>
                    ))}
                </div>
            ))}

            {/* Row for Backspace and Enter buttons */}
            <Row className="justify-content-md-center">
                <Col md="auto">
                    {/* Backspace button */}
                    <Button variant="danger" onClick={() => handleBtnClick("Backspace")}><IoBackspaceOutline /></Button>{' '}
                </Col>
                &nbsp;
                <Col md="auto">
                    {/* Enter button */}
                    <Button variant="success" onClick={() => handleBtnClick("Enter")}> <BsArrowReturnLeft /></Button>{' '}
                </Col>
            </Row>
        </div>
    );
};

export default Keyboard;

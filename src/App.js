import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';
import Home from './Home'; // Importing Home component
import Help from './components/help'; // Importing Help component
import poemtoday from "./data/poemtoday"; // Importing poem of the day data
import poemspractice from "./data/poemsdictionary"; // Importing practice poems data
import { useFlags } from 'flagsmith/react'; // Importing useFlags hook from flagsmith
import logo from './logo.svg';

function App() {
  // localStorage.clear();
  // State declarations
  const [selectedPage, setSelectedPage] = useState('today'); // State for selected page
  const [expand, setExpand] = useState(false); // State for expanding navbar
  const { help_popup: help_popup } = useFlags(['help_popup']); // Getting flag for help popup

  // Function to handle page change
  const handlePageChange = (page) => {
    setSelectedPage(page);
    setExpand(false);
  };

  // Function to handle practice click
  const handlePracticeClick = () => {
    handlePageChange('practice');
  };

  // Function to check if the stored date is from the previous day
  const isPreviousDay = (storedDate) => {
    const storedDateObj = new Date(storedDate);
    const today = new Date();
    return today.getDate() !== storedDateObj.getDate();
  };

  // Effect to handle storage of today's date and clearing storage if date is from previous day
  useEffect(() => {
    // Retrieve the stored date from local storage
    const storedDate = localStorage.getItem('storedDate');

    // Check if stored date is from the previous day and clear local storage if true
    if (storedDate && isPreviousDay(storedDate)) {
      localStorage.clear();
    }

    // Store today's date in local storage
    const today = new Date();
    localStorage.setItem('storedDate', today.toDateString());
  }, []);

  // JSX
  return (
    <>
      {/* Navbar */}
      <Navbar expand={expand ? "md" : false} className="bg-body-tertiary mb-3 fixed-top zindex">
        <Container fluid>
        <Navbar.Brand href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Poemdle logo"
            />
          </Navbar.Brand>
          <Navbar.Brand href="/" className="mx-auto">
            <h2>🅿🅾🅴🅼🅳🅻🅴</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} onClick={() => setExpand(!expand)} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
            show={expand}
            onHide={() => setExpand(false)}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                <h2>Poemdle</h2>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {/* Navigation links */}
                <Nav.Link onClick={() => handlePageChange('today')}>Poem of the day</Nav.Link>
                <Nav.Link onClick={() => handlePageChange('practice')}>Practice</Nav.Link>
                {/* Render help link if enabled */}
                {help_popup.enabled && <Nav.Link onClick={() => handlePageChange('help')}>How to play</Nav.Link>}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Main content */}
      <Container fluid>
        <Row>&nbsp;</Row>
        {/* Conditional rendering based on selected page */}
        {selectedPage === 'today' && <Home poemsdictionary={poemtoday} daily={true} onPracticeClick={handlePracticeClick}/>}
        {selectedPage === 'practice' && <Home poemsdictionary={poemspractice} daily={false} />}
        {help_popup.enabled && selectedPage === 'help' && <Help />}
      </Container>
    </>
  );
}

export default App;

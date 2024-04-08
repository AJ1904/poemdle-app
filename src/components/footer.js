import React from "react";
import { AiFillGithub } from "react-icons/ai";

// Footer component
const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="credits">
                    {/* Developer information */}
                    <p>Developed by <a href="/">Ayushri Jain</a></p>
                    {/* GitHub link */}
                    <a href="https://github.com/aj1904/poemdle-app" target="_blank" rel="noreferrer">
                        <div className="github">
                            <AiFillGithub size="20px" className="icon" /> Github
                        </div>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

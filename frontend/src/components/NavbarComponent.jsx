// src/components/NavbarComponent.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; // Use NavLink for active link styling
import LanguageSwitcher from './LanguageSwitcher'; // Import the LanguageSwitcher

/**
 * @typedef {object} NavbarComponentProps
 * Renders a responsive navigation bar with links and a language switcher.
 */
export default function NavbarComponent() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={NavLink} to="/dashboard">Handicap App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/dashboard" end>
                            Dashboard
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/login">
                            Login
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/register">
                            Register
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {/* Language Switcher on the right side of the Navbar */}
                        <LanguageSwitcher />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

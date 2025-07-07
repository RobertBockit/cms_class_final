// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap'; // Using react-bootstrap Dropdown

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();


    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="d-flex align-items-center">
                <span className="me-2">🌐</span> {i18n.language.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('de')}>Deutsch</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

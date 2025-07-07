// src/RegistrationPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useRegistrationStore } from '../store/registrationStore'; // Assuming this path is correct
import RegistrationStep1 from '../forms/RegistrationStep1';
import RegistrationStep2 from '../forms/RegistrationStep2';

/**
 * @typedef {object} RegistrationPageProps
 * Main component for the multi-step registration process.
 */
export default function RegistrationPage() {
    const { step } = useRegistrationStore();
    const { t } = useTranslation();

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 d-flex justify-content-center align-items-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="shadow-sm p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">{t('registration.title')}</h2>
                            <p className="text-center text-muted mb-4">
                                {t('registration.description') || 'Register your account in a few simple steps.'}
                            </p>

                            {step === 1 && <RegistrationStep1 />}
                            {step === 2 && <RegistrationStep2 />}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

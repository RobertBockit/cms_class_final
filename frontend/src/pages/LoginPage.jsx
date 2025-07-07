// src/LoginPage.jsx
import React, { useState } from 'react'; // Import useState for loading and error states
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const loginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }), // Password is required for login
});

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null);     // State for API error messages

    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { handleSubmit, register, formState: { errors } } = form;

    const onSubmit = async (values) => {
        setLoading(true);
        setError(null);

        try {
            const strapiApiUrl = 'http://localhost:1337/api/auth/local';
            const response = await fetch(strapiApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: values.email,
                    password: values.password,
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                // Login successful
                localStorage.setItem('jwt', responseData.jwt);
                localStorage.setItem('user', JSON.stringify(responseData.user));
                console.log('JWT saved:', localStorage.getItem('jwt'));

                // Redirect to dashboard or another protected page
                navigate('/dashboard');
            } else {
                // Login failed
                console.error('Strapi Login Error:', responseData);
                const errorMessage = responseData.error?.message || t('login.error_generic') ;
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Network or unexpected error:', err);
            setError(t('login.error_network'))
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 d-flex justify-content-center align-items-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="shadow-sm p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">{t("login.title")}</h2>
                            <p className="text-center text-muted mb-4">{t("login.description") || "Enter your credentials to access your account."}</p>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3" controlId="loginEmail">
                                    <Form.Label>{t("login.email")}</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder={t("login.email_placeholder") || "m@example.com"}
                                        {...register("email")}
                                        isInvalid={!!errors.email}
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="loginPassword">
                                    <Form.Label>{t("login.password")}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder={t("login.password_placeholder") || "••••••••"}
                                        {...register("password")}
                                        isInvalid={!!errors.password}
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            {t('login.submitting') || 'Logging in...'}
                                        </>
                                    ) : (
                                        t("login.submit")
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// src/forms/RegistrationStep1.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useRegistrationStore } from '../store/registrationStore';

// Define Zod schema for Registration Step 1
const registrationStep1Schema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

/**
 * @typedef {object} RegistrationStep1Props
 * Component for the first step of user registration.
 */
export default function RegistrationStep1() {
    const { t } = useTranslation();
    const { setStep, setData, data } = useRegistrationStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const form = useForm({
        resolver: zodResolver(registrationStep1Schema),
        defaultValues: {
            email: data.email || '',
            password: data.password || '',
        },
    });

    const { register, handleSubmit, formState: { errors } } = form;

    /**
     * Handles form submission for step 1, making an API call to Strapi for user registration.
     * @param {object} values - Form data (email, password).
     */
    const onSubmit = async (values) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const strapiApiUrl = 'http://localhost:1337/api/auth/local/register';

            const response = await fetch(strapiApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.email, // Strapi often uses username for registration, or email
                    email: values.email,
                    password: values.password,
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Strapi User Registration Success:', responseData);
                setSuccess(t('registration.success_step1') || 'User created successfully! Proceeding to next step.');
                // Store JWT and user data in the store for use in Step 2
                setData({
                    ...values, // Keep email and password in store if needed for review
                    jwt: responseData.jwt,
                    user: responseData.user,
                });
                setStep(2);
            } else {
                console.error('Strapi User Registration Error:', responseData);
                const errorMessage = responseData.error?.message || t('registration.error_step1_generic') || 'User registration failed. Please try again.';
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Network or unexpected error during Step 1:', err);
            setError(t('registration.error_step1_network') || 'An unexpected error occurred during registration. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3" controlId="registrationEmail">
                <Form.Label>{t('registration.email')}</Form.Label>
                <Form.Control
                    type="email"
                    placeholder={t('registration.email_placeholder') || 'Enter your email'}
                    {...register('email')}
                    isInvalid={!!errors.email}
                    disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="registrationPassword">
                <Form.Label>{t('registration.password')}</Form.Label>
                <Form.Control
                    type="password"
                    placeholder={t('registration.password_placeholder') || 'Enter your password'}
                    {...register('password')}
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
                        {t('registration.submitting_step1') || 'Creating user...'}
                    </>
                ) : (
                    t('registration.next')
                )}
            </Button>
        </Form>
    );
}

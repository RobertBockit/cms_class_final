// src/forms/RegistrationStep2.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useRegistrationStore } from '../store/registrationStore';
import { useNavigate } from 'react-router-dom';

// Helper function to validate YYYY-MM-DD format
const isValidDateFormat = (dateString) => {
    if (!dateString) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

const registrationStep2Schema = z.object({
    isCompanion: z.boolean().optional(),
    number: z.string(),
    issuingDate: z.string(),
    expiry: z.string(),
    proof: z.any().optional(),
}).refine((data) => {
    if (data.isCompanion) {
        return true; // If companion, other fields are not required
    }
    // If not a companion, the fields are required
    return (
        data.number.length > 0 &&
        data.issuingDate.length > 0 &&
        data.expiry.length > 0
    );
}, {
    // This message will be shown if the refinement fails, but we handle individual messages below
    message: "Card details are required if you are not a companion.",
    // We can specify path to have a more granular error, but for now this is fine.
});

/**
 * @typedef {object} RegistrationStep2Props
 * Component for the second step of user registration.
 */
export default function RegistrationStep2() {
    const { t } = useTranslation();
    const { setStep, setData, data, resetStore } = useRegistrationStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const form = useForm({
        resolver: zodResolver(registrationStep2Schema),
        defaultValues: {
            isCompanion: data.isCompanion || false,
            number: data.number || '',
            issuingDate: data.issuingDate || '',
            expiry: data.expiry || '',
        },
    });

    const { register, handleSubmit, formState: { errors }, watch } = form;
    const isCompanion = watch('isCompanion');

    const onSubmit = async (values) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { jwt, user } = data;

        if (!jwt || !user || !user.id) {
            setError(t('registration.error_no_user_data') || 'User data missing. Please go back to Step 1.');
            setLoading(false);
            return;
        }

        // If the user is a companion, skip card creation and just log them in.
        if (values.isCompanion) {
            localStorage.setItem('jwt', jwt);
            localStorage.setItem('user', JSON.stringify(user));
            setSuccess('Registration successful! Welcome.');
            resetStore();
            navigate('/dashboard');
            setLoading(false);
            return;
        }

        try {
            let uploadedFileId = null;

            // Step 1: Upload the file to the media library if it exists
            const hasFileUpload = values.proof && values.proof.length > 0 && values.proof[0] instanceof File;
            if (hasFileUpload) {
                const fileFormData = new FormData();
                fileFormData.append('files', values.proof[0]);

                const uploadResponse = await fetch('http://localhost:1337/api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                    body: fileFormData,
                });

                const uploadData = await uploadResponse.json();

                if (uploadResponse.ok && uploadData && uploadData.length > 0) {
                    uploadedFileId = uploadData[0].id; // Get the ID of the uploaded file
                } else {
                    const uploadError = uploadData.error?.message || 'File upload failed.';
                    console.error('Strapi Upload Error:', uploadData);
                    setError(uploadError);
                    setLoading(false);
                    return;
                }
            }

            // Step 2: Create the disability card entry, linking the uploaded file if available
            const payload = {
                data: {
                    number: values.number,
                    issuingDate: values.issuingDate,
                    expiry: values.expiry,
                    reviewStatus: 'pending',
                    user: user.id,
                    ...(uploadedFileId && { proof: uploadedFileId }), // Conditionally add proof ID
                }
            };

            const createResponse = await fetch('http://localhost:1337/api/disability-cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify(payload),
            });

            const responseData = await createResponse.json();

            if (createResponse.ok) {
                console.log('Strapi Disability Card Creation Success:', responseData);

                // Save JWT and user data to localStorage, just like in login
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('user', JSON.stringify(user));

                setSuccess(t('registration.success_step2') || 'Disability card created successfully! Registration complete.');
                resetStore(); // Clear the registration store
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                console.error('Strapi Disability Card Creation Error:', responseData);
                const errorMessage = responseData.error?.message || t('registration.error_step2_generic') || 'Disability card creation failed. Please try again.';
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Network or unexpected error during Step 2:', err);
            setError(t('registration.error_step2_network') || 'An unexpected error occurred. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3" controlId="isCompanion">
                <Form.Check
                    type="checkbox"
                    label={t('registration.isCompanion') || 'I am a companion'}
                    {...register('isCompanion')}
                    disabled={loading}
                />
            </Form.Group>

            {!isCompanion && (
                <>
                    <Form.Group className="mb-3" controlId="number">
                        <Form.Label>{t('registration.cardId')}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t('registration.cardId_placeholder') || 'Enter card ID'}
                            {...register('number')}
                            isInvalid={!!errors.number}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.number?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="issuingDate">
                        <Form.Label>{t('registration.issueDate')}</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('issuingDate')}
                            isInvalid={!!errors.issuingDate}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.issuingDate?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="expiry">
                        <Form.Label>{t('registration.expiryDate')}</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('expiry')}
                            isInvalid={!!errors.expiry}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.expiry?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="proof">
                        <Form.Label>{t('registration.photo')}</Form.Label>
                        <Form.Control
                            type="file"
                            {...register('proof')}
                            isInvalid={!!errors.proof}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.proof?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </>
            )}

            <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => setStep(1)} disabled={loading}>
                    {t('registration.back')}
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
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
                            {t('registration.submitting_step2') || 'Creating card...'}
                        </>
                    ) : (
                        t('registration.submit')
                    )}
                </Button>
            </div>
        </Form>
    );
}

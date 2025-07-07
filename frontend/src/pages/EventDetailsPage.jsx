import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function EventDetailsPage() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://localhost:1337/api/names/${id}?populate=*&locale=${i18n.language}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch event details.');
                }

                const eventData = await response.json();
                setEvent(eventData.data);
                console.log(event);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('eventDetails.loading', 'Loading...')}</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!event) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Alert variant="warning">{t('eventDetails.notFound', 'Event not found.')}</Alert>
            </Container>
        );
    }
    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        {event.image && (
                            <Card.Img variant="top" src={`http://localhost:1337${event.image[0].url}`} />
                        )}
                        <Card.Body>
                            <Card.Title as="h1" className="mb-4">{event.name}</Card.Title>
                            <p><strong>{t('eventDetails.description', 'Description')}:</strong> {event.description}</p>
                            <p><strong>{t('eventDetails.startTime', 'Start Time')}:</strong> {new Date(event.start_time).toLocaleString()}</p>
                            <p><strong>{t('eventDetails.endTime', 'End Time')}:</strong> {new Date(event.end_time).toLocaleString()}</p>
                            <p><strong>{t('eventDetails.eventType', 'Event Type')}:</strong> {event.eventType}</p>
                            <p><strong>{t('eventDetails.language', 'Language')}:</strong> {event.language}</p>
                            <p><strong>{t('eventDetails.capacity', 'Capacity')}:</strong> {event.capacity}</p>
                            {event.website && <p><strong>{t('eventDetails.website', 'Website')}:</strong> <a href={event.website} target="_blank" rel="noopener noreferrer">{event.website}</a></p>}
                            {/* Render other relations and components as needed */}
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="secondary" onClick={() => navigate(-1)}>{t('eventDetails.goBack', 'Go Back')}</Button>
                            <Button variant="primary" className="ms-2">{t('eventDetails.buyTicket', 'Buy Ticket')}</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

import React, { useState, useEffect } from 'react';
import { Card, Alert, Spinner, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function EventsComponent() {
    const { t, i18n } = useTranslation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                setError('You are not logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:1337/api/names?populate=*&locale=${i18n.language}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch events.');
                }

                const eventsData = await response.json();
                setEvents(eventsData.data || []);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('events.loading', 'Loading events...')}</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="text-center">
                {error}
            </Alert>
        );
    }

    return (
        <Card className="shadow-sm p-4 mt-4">
            <Card.Body>
                <h3 className="text-center mb-4">{t('dashboard.events_title', 'Events')}</h3>
                {events.length > 0 ? (
                    events.map((event) => (
                        <Card key={event.id} className="mb-3">
                            <Card.Body>
                                {event.image && (
                                    <img
                                        src={`http://localhost:1337${event.image[0].url}`}
                                        alt={event.name || 'Event image'}
                                        className="img-fluid mb-3 rounded"
                                    />
                                )}
                                <Card.Title>{event.name || t('events.unnamed_event', 'Unnamed Event')}</Card.Title>
                                {event.description && <Card.Text>{event.description}</Card.Text>}
                                <p><strong>{t('events.start_time', 'Starts')}:</strong> {new Date(event.start_time).toLocaleString()}</p>
                                <p><strong>{t('events.end_time', 'Ends')}:</strong> {new Date(event.end_time).toLocaleString()}</p>
                                {event.website && <p><strong>{t('events.website', 'Website')}:</strong> <a href={event.website} target="_blank" rel="noopener noreferrer">{event.website}</a></p>}
                                <Link to={`/event/${event.documentId}`}>
                                    <Button variant="primary">{t('events.see_details', 'See Details')}</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="text-center">{t('events.no_events', 'No events found.')}</p>
                )}
            </Card.Body>
        </Card>
    );
}

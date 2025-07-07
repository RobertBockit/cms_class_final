import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Container, Row, Col, Card, Alert, Spinner, Button} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import EventsComponent from '../components/EventsComponent';


export default function DashboardPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            const jwt = localStorage.getItem('jwt');

            if (!jwt) {
                navigate('/login');
                return;
            }

            try {
                const userResponse = await fetch('http://localhost:1337/api/users/me?populate=role', {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user details.');
                }

                const fullUser = await userResponse.json();
                setUser(fullUser);
                console.log(fullUser);
                localStorage.setItem('user', JSON.stringify(fullUser));

                if (fullUser.role?.name === 'venueOwner') {
                    const venuesResponse = await fetch(`http://localhost:1337/api/locations?populate=*&locale=${i18n.language}`, {
                        headers: {
                            'Authorization': `Bearer ${jwt}`,
                        },
                    });

                    if (!venuesResponse.ok) {
                        throw new Error('Failed to fetch venues.');
                    }

                    const venuesData = await venuesResponse.json();
                    setVenues(venuesData.data || []);
                    console.log(venuesData.data);
                }
            } catch (e) {
                console.error('Failed to load data:', e);
                setError(t('dashboard.error_loading_data') || 'Failed to load data. Please log in again.');
                localStorage.removeItem('jwt');
                localStorage.removeItem('user');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndLoadData();
    }, [navigate, t]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('dashboard.loading') || 'Loading...'}</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Alert variant="danger" className="text-center">
                    {error}
                    <Button variant="link" onClick={() => navigate('/login')}>
                        {t('dashboard.go_to_login') || 'Go to Login'}
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 d-flex justify-content-center align-items-center">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Card className="shadow-sm p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">{t('dashboard.title', { username: user.username || user.email })}</h2>
                            <p className="text-center text-muted mb-4">{t('dashboard.welcome_message') || 'Welcome to your personalized dashboard!'}</p>

                            <div className="mb-4">
                                <h4 className="mb-3">{t('dashboard.user_details') || 'Your Details:'}</h4>
                                <p><strong>{t('dashboard.username') || 'Username'}:</strong> {user.username}</p>
                                <p><strong>{t('dashboard.email') || 'Email'}:</strong> {user.email}</p>
                                <p><strong>{t('dashboard.user_id') || 'User ID'}:</strong> {user.id}</p>
                                {user.role && <p><strong>{t('dashboard.role') || 'Role'}:</strong> {user.role.name}</p>}
                            </div>

                            <div className="text-center mt-4">
                                <Button variant="danger" onClick={() => {
                                    localStorage.removeItem('jwt');
                                    localStorage.removeItem('user');
                                    navigate('/login');
                                }}>
                                    {t('dashboard.logout') || 'Logout'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    <EventsComponent />

                    {user.role?.name === 'venueOwner' && venues.length > 0 && (
                        <Card className="shadow-sm p-4 mt-4">
                            <Card.Body>
                                <h3 className="text-center mb-4">{t('dashboard.venues_title') || 'Your Venues'}</h3>
                                {venues.map((venue) => {
                                    console.log(venue.Name);
                                    if (!venue || !venue.id) {
                                        return "null";
                                    }

                                    return (
                                        <Card key={venue.id} className="mb-3">
                                            <Card.Body>
                                                {venue.location_overview !== null && (
                                                    <img
                                                        src={`http://localhost:1337${venue.location_overview[0]?.url}`}
                                                        alt={venue.Name || 'Venue image'}
                                                        className="img-fluid mb-3 rounded"
                                                    />
                                                )}
                                                <Card.Title>{venue.Name || t('dashboard.unnamed_venue', 'Unnamed Venue')}</Card.Title>
                                                {venue.Description && <Card.Text>{venue.Description}</Card.Text>}
                                                {venue.Website && <p><strong>{t('dashboard.website', 'Website')}:</strong> <a href={venue.Website} target="_blank" rel="noopener noreferrer">{venue.Website}</a></p>}
                                                {venue.opening_hours && <p><strong>{t('dashboard.opening_hours', 'Opening Hours')}:</strong> {venue.opening_hours}</p>}
                                                {venue.capacity && <p><strong>{t('dashboard.capacity', 'Capacity')}:</strong> {venue.capacity}</p>}
                                                {venue.size && <p><strong>{t('dashboard.size', 'Size')}:</strong> {venue.size} sq meters</p>}
                                                
                                                {venue.contact_data && (
                                                    <>
                                                        <hr />
                                                        <h5>{t('dashboard.contact_info', 'Contact Information')}</h5>
                                                        {(venue.contact_data.first_name || venue.contact_data.last_name) && (
                                                            <p><strong>{t('dashboard.contact_person', 'Name')}:</strong> {venue.contact_data.first_name} {venue.contact_data.last_name}</p>
                                                        )}
                                                        {venue.contact_data.email && <p><strong>{t('dashboard.contact_email', 'Email')}:</strong> {venue.contact_data.email}</p>}
                                                        {venue.contact_data.phone && <p><strong>{t('dashboard.contact_phone', 'Phone')}:</strong> {venue.contact_data.phone}</p>}
                                                    </>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

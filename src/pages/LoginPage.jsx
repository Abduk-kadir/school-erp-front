// LoginPage.jsx
import React from 'react';
import { Carousel } from 'react-bootstrap'; // ← Make sure to install & import
import '../assets/css/loginpage.css'
import { Card, Form, Button, Row, Col } from 'react-bootstrap';


const LoginPage = () => {
    // You can replace these with your own image URLs (school photos work best)
    const carouselImages = [
        {
            src: 'https://images.pexels.com/photos/20853049/pexels-photo-20853049/free-photo-of-university-building-in-india-in-sunlight.jpeg',
            alt: 'Modern Indian university building in sunlight',
        },
        {
            src: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'School campus entrance',
        },

    ];

    return (
        <div className="container-fluid login-container"  >
            <div className="row  g-0 mt-50">

                {/* Left Side - Carousel */}
                <div className="col-lg-6 left-side p-0 " style={{ height: '80vh' }} >


                    <Carousel
                        fade
                        controls={false}           // hide arrows if you want clean look
                        indicators={true}          // keep dots at bottom
                        interval={4500}            // change to your preferred speed (in ms)
                        pause={false}              // ← important: don't pause on hover
                        ride="carousel"            // ← makes it start autoplay immediately on load
                    >
                        {carouselImages.map((image, index) => (
                            <Carousel.Item key={index} interval={5000}>  {/* you can set per-slide interval too */}
                                <div
                                    className="carousel-image"
                                    style={{ backgroundImage: `url(${image.src})` }}
                                ></div>
                                
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>

                {/* Right Side - Login Form (unchanged from your previous version) */}
                <div className="col-lg-6 right-side d-flex align-items-center justify-content-center bg-white">
                    <Card className="shadow-sm border-0" style={{
                        maxWidth: '520px',
                        width: '100%',
                        minHeight: '400px',      // ← made card noticeably taller
                        borderRadius: '20px',
                        padding: '10px'
                    }}>
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-10">
                                <h3 className="fw-bold text-primary">Welcome</h3>

                            </div>

                            <Form>
                                <Form.Group as={Row} className="mb-40 align-items-center" controlId="formUsername">
                                    <Form.Label column sm={4} className='fw-medium fs-5' >
                                        Username
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Email"
                                            required
                                            size="lg"


                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-20 align-items-center" controlId="formUsername">
                                    <Form.Label column sm={4} className='fw-medium fs-5'>
                                        Password
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Password"
                                            required
                                            size="lg"

                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-20 align-items-center" controlId="formUsername">
                                    <Form.Label column sm={4} className='fw-medium fs-5'>
                                        Academic Year
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Select
                                            size="lg"
                                            required

                                        >
                                            <option value="">Select academic year</option>
                                            <option value="2025-2026">2025-2026</option>
                                            <option value="2024-2025">2024-2025</option>
                                            <option value="2023-2024">2023-2024</option>
                                            <option value="2022-2023">2022-2023</option>
                                            <option value="2021-2022">2021-2022</option>
                                            {/* Add more years as needed */}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-20 align-items-center" controlId="formLoginAs">
                                    <Form.Label column sm={4} className="fw-medium fs-5">
                                        Login As
                                    </Form.Label>

                                    <Col sm={8}>
                                        <div className="d-flex gap-5 align-items-center" style={{ paddingTop: '0.35rem' }}>

                                            <Form.Check
                                                type="radio"
                                                id="loginAsParent"
                                                name="loginAs"
                                                label="Parent"
                                                className="fs-5 d-flex align-items-center gap-2 mb-0"
                                                style={{ lineHeight: 1.4 }}
                                                required
                                            />

                                            <Form.Check
                                                type="radio"
                                                id="loginAsStaff"
                                                name="loginAs"
                                                label="Staff"
                                                className="fs-5 d-flex align-items-center gap-2 mb-0"
                                                style={{ lineHeight: 1.4 }}
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Form.Group>




                                <div className="d-flex justify-content-end mt-10">
                                    <Button
                                        variant="success"
                                        size="lg"
                                        type="submit"
                                        className="px-5 me-3"           // ← margin-right here
                                    >
                                        Fill Student Detail
                                    </Button>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        type="submit"
                                        className="px-5"
                                    >
                                        Sign In
                                    </Button>
                                </div>

                                <div className="d-flex justify-content-end mt-4 small text-muted">
                                    Forgot password?{' '}
                                    <a href="#" className="text-primary text-decoration-none">
                                        Reset here
                                    </a>
                                </div>


                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
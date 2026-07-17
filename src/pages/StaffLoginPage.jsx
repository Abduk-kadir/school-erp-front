// StaffLoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Carousel, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../assets/css/loginpage.css';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { getFCMToken } from '../services/fcmService';

const buildCarsoulImageUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${baseUrl}${path}`;
};

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email / Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  academicYear: Yup.string()
    .required('Please select an academic year'),
});

const StaffLoginPage = () => {
  const navigate = useNavigate();
  const [fcmToken, setFcmToken] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    getFCMToken().then(setFcmToken);
  }, []);

  useEffect(() => {
    const fetchCarsoul = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/carsoul`);
        setCarouselImages(response?.data?.data || []);
      } catch (error) {
        console.error('Failed to load carousel images:', error);
        setCarouselImages([]);
      }
    };
    fetchCarsoul();
  }, []);

  return (
    <div className="container-fluid login-container border">
      <div className="row g-0 mt-50">
        {/* Left Side - Carousel */}
        <div className="col-lg-6 left-side p-0" style={{ height: '80vh' }}>
          <Carousel
            fade
            controls={false}
            indicators={carouselImages.length > 1}
            interval={4500}
            pause={false}
            ride="carousel"
          >
            {carouselImages.map((image) => {
              const src = buildCarsoulImageUrl(image.image_url);
              const hasTitle = Boolean(image.title);
              const hasHeading = Boolean(image.heading);
              const hasSubheading = Boolean(image.subheading);
              const showCaption = hasTitle || hasHeading || hasSubheading;

              return (
                <Carousel.Item key={image.id} interval={5000}>
                  <div
                    className="carousel-image"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                  {showCaption && (
                    <Carousel.Caption>
                      {hasTitle && <h3>{image.title}</h3>}
                      {hasHeading && <h5>{image.heading}</h5>}
                      {hasSubheading && <p>{image.subheading}</p>}
                    </Carousel.Caption>
                  )}
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>

        {/* Right Side - Staff Login Form */}
        <div className="col-lg-6 right-side d-flex align-items-center justify-content-center bg-white">
          <Card
            className="shadow-sm border-0"
            style={{
              maxWidth: '520px',
              width: '100%',
              minHeight: '400px',
              borderRadius: '20px',
              padding: '10px',
            }}
          >
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-10">
                <h4 className="fw-bold text-primary">Staff Login</h4>
              </div>

              <Formik
                initialValues={{
                  email: '',
                  password: '',
                  academicYear: '',
                }}
                // validationSchema={loginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const res = await axios.post(`${baseUrl}/api/staff/login`, {
                      email: values.email,
                      password: values.password,
                      fcmToken: fcmToken,
                    });
                    let token = res?.data?.token;
                    localStorage.setItem('token', token);
                    navigate('/dashboard');
                    console.log('staff is login successfully', res?.data?.data);
                  } catch (err) {
                    alert(err?.response?.data?.message);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, touched, errors }) => (
                  <FormikForm noValidate>
                    {/* Username / Email */}
                    <Form.Group as={Row} className="mb-10 align-items-center">
                      <Form.Label column sm={4} className="fw-medium fs-5">
                        Username
                      </Form.Label>
                      <Col sm={8}>
                        <Field
                          as={Form.Control}
                          type="email"
                          name="email"
                          placeholder="Enter Email"
                          size="lg"
                          isInvalid={touched.email && !!errors.email}
                          isValid={touched.email && !errors.email}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Col>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group as={Row} className="mb-10 align-items-center">
                      <Form.Label column sm={4} className="fw-medium fs-5">
                        Password
                      </Form.Label>
                      <Col sm={8}>
                        <Field
                          as={Form.Control}
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          size="lg"
                          isInvalid={touched.password && !!errors.password}
                          isValid={touched.password && !errors.password}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Col>
                    </Form.Group>

                    {/* Academic Year */}
                    <Form.Group as={Row} className="mb-10 align-items-center">
                      <Form.Label column sm={4} className="fw-medium fs-5">
                        Academic Year
                      </Form.Label>
                      <Col sm={8}>
                        <Field
                          as={Form.Select}
                          name="academicYear"
                          size="lg"
                          isInvalid={touched.academicYear && !!errors.academicYear}
                          isValid={touched.academicYear && !errors.academicYear}
                        >
                          <option value="">Select academic year</option>
                          <option value="2025-2026">2025-2026</option>
                          <option value="2024-2025">2024-2025</option>
                          <option value="2023-2024">2023-2024</option>
                          <option value="2022-2023">2022-2023</option>
                          <option value="2021-2022">2021-2022</option>
                        </Field>
                        <ErrorMessage
                          name="academicYear"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Col>
                    </Form.Group>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        className="px-5"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </div>

                    <div className="d-flex justify-content-end mt-3 small text-muted">
                      Forgot password?{' '}
                      <a href="#" className="text-primary text-decoration-none">
                        Reset here
                      </a>
                    </div>
                  </FormikForm>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffLoginPage;

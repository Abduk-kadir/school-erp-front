// LoginPage.jsx
import React, { useState } from 'react';
import { Carousel, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../assets/css/loginpage.css';
import { useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl'
import { useDispatch, useSelector } from 'react-redux';
import { setRegistrationNo } from '../redux/slices/registrationNo';
import { getPersonalInformationForm } from '../redux/slices/dynamicForm/personalInfoFormSlice';


// Validation schema with Yup
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email / Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  academicYear: Yup.string()
    .required('Please select an academic year'),
  loginAs: Yup.string()
    .oneOf(['Parent', 'Staff'], 'Please select who you are logging in as')
    .required('Login role is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [personalInformations,setPersonalInformations]=useState([])
  const dispatch=useDispatch()
   useEffect(() => {
          dispatch(getPersonalInformationForm({}));
      }, []);


 console.log('personal information is:',personalInformations)


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
    <div className="container-fluid login-container border">
      <div className="row g-0 mt-50">
        {/* Left Side - Carousel */}
        <div className="col-lg-6 left-side p-0" style={{ height: '80vh' }}>
          <Carousel
            fade
            controls={false}
            indicators={true}
            interval={4500}
            pause={false}
            ride="carousel"
          >
            {carouselImages.map((image, index) => (
              <Carousel.Item key={index} interval={5000}>
                <div
                  className="carousel-image"
                  style={{ backgroundImage: `url(${image.src})` }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Right Side - Login Form with Formik */}
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
                <h4 className="fw-bold text-primary">Welcome to our Institute</h4>
              </div>

              <Formik
                initialValues={{
                  email: '',
                  password: '',
                  academicYear: '',
                  loginAs: '',
                  reg_no:''
                  
                }}
               // validationSchema={loginSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {

                  console.log('login is called')
                  try{
                  let res=await axios.post(`${baseUrl}/api/personal-information/all`,{email:values.email})
                   setPersonalInformations(res.data.data)
                   console.log('form value is:',values)
                   if(personalInformations.length>0){
                  let {data}=await axios.post(`${baseUrl}/api/personal-information/login`,{email:values.email,reg_no:values.reg_no})
                  alert('login successfully')
                  let reg_no=data?.reg_no 
                  let token=data?.token
                  localStorage.setItem("token",token)
                  localStorage.setItem("reg_no",reg_no)
                  let res2=await axios.get(`${baseUrl}/api/form-status/${values.reg_no}`)
                  dispatch(setRegistrationNo({ reg_no:values.reg_no }))
                  let current_step=res2?.data?.data?.current_step
                  console.log('current step',current_step)
                  switch(current_step){
                    case 1:
                      navigate(`/registration?step=${current_step}&reg_no=${reg_no}`);
                      break;
                    case 2:
                      navigate(`personal-information?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                       case 3:
                      navigate(`/educational-detail-stage?step=${current_step}&reg_no=${reg_no}`);
                      break;
                    case 4:
                      navigate(`/subject-stage?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                       case 5:
                       navigate(`/parent-particular-stage?step=${current_step}&reg_no=${reg_no}`)
                      break;
                    case 6:
                      navigate(`/transport-detail-stage?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                      case 7:
                      navigate(`/other-information-stage?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                      case 8:
                      navigate(`/declaration-stage?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                       case 9:
                      navigate(`/document-stage?step=${current_step}&reg_no=${reg_no}`)
                      break;  
                  }

                   }
                  
            
                   

                  }
                  catch(err){
                    alert(err)
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
                          isInvalid={touched.username && !!errors.username}
                          isValid={touched.username && !errors.username}
                        />
                        <ErrorMessage
                          name="username"
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
                    {personalInformations.length>0&&<Form.Group as={Row} className="mb-10 align-items-center">
                      <Form.Label column sm={4} className="fw-medium fs-5">
                        Select Student
                      </Form.Label>
                     {<Col sm={8}>
                        <Field
                          as={Form.Select}
                          name="reg_no"
                          size="lg"
                          isInvalid={touched.academicYear && !!errors.academicYear}
                          isValid={touched.academicYear && !errors.academicYear}
                        >
                          <option value="">Student</option>
                         
                          {personalInformations.map(elem=>(
                          <option value={elem.reg_no}>{`${elem.first_name}-${elem.class}`}</option>
                            
                          ))}
                        </Field>
                        <ErrorMessage
                          name="class"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Col>}
                     
                    </Form.Group>}


                    {/* Login As */}
                    <Form.Group as={Row} className="mb-10 align-items-center">
                      <Form.Label column sm={4} className="fw-medium fs-5">
                        Login As
                      </Form.Label>
                      <Col sm={8}>
                        <div className="d-flex gap-5 align-items-center" style={{ paddingTop: '0.35rem' }}>
                          <Field
                            as={Form.Check}
                            type="radio"
                            id="loginAsParent"
                            name="loginAs"
                            value="Parent"
                            label="Parent"
                            className="fs-5 d-flex align-items-center gap-2 mb-0"
                            style={{ lineHeight: 1.4 }}
                            feedbackType="invalid"
                          />
                          <Field
                            as={Form.Check}
                            type="radio"
                            id="loginAsStaff"
                            name="loginAs"
                            value="Staff"
                            label="Staff"
                            className="fs-5 d-flex align-items-center gap-2 mb-0"
                            style={{ lineHeight: 1.4 }}
                            feedbackType="invalid"
                          />
                        </div>
                        <ErrorMessage
                          name="loginAs"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </Col>
                    </Form.Group>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        variant="success"
                        size="lg"
                        type="button" // ← not submit → won't trigger form submit
                        className="px-5 me-3"
                        onClick={() => navigate('/registration')}
                      >
                        Fill Student Detail
                      </Button>

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

export default LoginPage;
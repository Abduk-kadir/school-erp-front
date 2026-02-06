import { getPersonalInformationForm } from "../../redux/slices/dynamicForm/personalInfoFormSlice";
import { getStage1 } from "../../redux/slices/stage1Sclice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import baseURL from "../../utils/baseUrl";
import axios from "axios";
import FormWizard from "./FormWizard";
import { Navigate, useNavigate } from "react-router-dom";
const PersonalInformationForm = () => {
    const navigate=useNavigate()
    const dispatch = useDispatch();
    let id=4;
   

    const wholeForm = useSelector(
        (state) => state?.personalInfoForms?.personalInfoForm?.data
    );
    let stageData= useSelector(
        (state) => state?.stage1?.stage1Data?.data
    );

    const personalFormfields = wholeForm ? wholeForm[0]?.fields : [];
    console.log('user data is:',stageData)

    const initialValues = useMemo(() => {
        if (stageData) return stageData;

        const values = { first_name: "", last_name: "",father_name:"",class:"",division:"",contact_number:"",
            email:"",password:"",dob:"",blood_group:""
         };
        personalFormfields.forEach((elem) => {
            values[elem.name] = "";
        });
        return values;
    }, [personalFormfields]);
    

    const validationSchema = Yup.object(
        personalFormfields.reduce((schema, field) => {

            schema[field.name] = Yup.string().required(`${field.label} is required`);


            return schema;
        },
            {
                first_name: Yup.string().required("First name is required"),
                last_name: Yup.string().required("Last name is required"),
                class: Yup.string().required("class is required"),
                division: Yup.string().required("division is required"),
                contact_number: Yup.string().required("contact is required"),
                father_name: Yup.string().required("father name is required"),
                email: Yup.string().required("email is required"),
                password: Yup.string().required("password is required"),
                dob:Yup.string().required("password is required"),
                blood_group:Yup.string().required("blood group is required"),

            })
    );

    useEffect(() => {
       dispatch(getPersonalInformationForm({}));
    dispatch(getStage1({}));
     
    }, [dispatch]);

    return (
        <div className="container mt-5">
            <FormWizard/>
            <div className="card p-4 shadow">
                <h3 className="mb-4">Personal Information Form</h3>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                   // validationSchema={validationSchema}
                    onSubmit={async(values, { resetForm }) => {
                       /* console.log('selected value:', values);
                        await axios.post(`${baseURL}/api/personal-information`,values)
                        alert("Form submitted successfully!");
                        resetForm();
                        */
                       navigate('/subject-stage')
                    }}
                        
                     
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="row">
                                <div className="col-3 mb-3">
                                    <label className="form-label">First Name</label>
                                    <Field name="first_name" type="text" className='form-control' />
                                    <ErrorMessage
                                        name="first_name"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                <div className="col-3 mb-3">
                                    <label className="form-label">Last Name</label>
                                    <Field name="last_name" type="text" className='form-control' />

                                 <ErrorMessage
                                        name="last_name"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                <div className="col-3 mb-3">
                                    <label className="form-label">Father Name</label>
                                    <Field name="father_name" type="text" className='form-control' />

                                 <ErrorMessage
                                        name="father_name"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                <div className="col-3 mb-3">
                                    <label className="form-label">Class</label>
                                    <Field name="class" type="text" className='form-control' />
                                    <ErrorMessage
                                        name="class"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                <div className="col-3 mb-3">
                                    <label className="form-label">Division</label>
                                    <Field name="division" type="text" className='form-control' />
                                    <ErrorMessage
                                        name="division"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                 <div className="col-3 mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <Field name="contact_number" type="text" className='form-control' />
                                    <ErrorMessage
                                        name="contact_number"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                 <div className="col-3 mb-3">
                                    <label className="form-label">Email</label>
                                    <Field name="email" type="email" className='form-control' />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                 <div className="col-3 mb-3">
                                    <label className="form-label">Password</label>
                                    <Field name="password" type="password" className='form-control' />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                 <div className="col-3 mb-3">
                                    <label className="form-label">Date of birth</label>
                                    <Field name="dob" type="text" className='form-control' />
                                    <ErrorMessage
                                        name="dob"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>
                                 <div className="col-3 mb-3">
                                    <label className="form-label">Blood group</label>
                                    <Field name="blood_group" type="text" className='form-control' />
                                    <ErrorMessage
                                        name="blood_group"
                                        component="div"
                                        className="text-danger mt-1"
                                    />

                                </div>

                                {personalFormfields.map((elem) => (
                                    <div className="col-3 mb-3" key={elem.name}>
                                        <label className="form-label">{elem.label}</label>

                                        {elem.type === "dropdown" ? (
                                            <Field as="select" name={elem.name} className="form-select">
                                                <option value="">{elem.placeholder}</option>
                                                {elem.options?.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.value}
                                                    </option>
                                                ))}
                                            </Field>
                                        ) : (
                                            <Field
                                                name={elem.name}
                                                className="form-control"
                                                placeholder={elem.placeholder}
                                            />
                                        )}

                                        <ErrorMessage
                                            name={elem.name}
                                            component="div"
                                            className="text-danger mt-1"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-end gap-3 mb-10">
                                <button
                                type="Previous"
                                className="btn btn-success mt-3 px-5"
                                onClick={() => navigate(-1)}
                            >
                                Previosus
                            </button>
                            <button
                                type="Next"
                                className="btn btn-success mt-3 px-5"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default PersonalInformationForm;

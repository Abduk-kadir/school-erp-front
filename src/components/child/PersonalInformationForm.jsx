import { getPersonalInformationForm } from "../../redux/slices/dynamicForm/personalInfoFormSlice";
import { getStage1 } from "../../redux/slices/stage1Sclice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect,useState ,useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import baseURL from "../../utils/baseUrl";
import axios from "axios";
import FormWizard from "./FormWizard";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { getRegistrationNo } from "../../redux/slices/registrationNo";
import { useReducer } from "react";

const PersonalInformationForm = () => {
    const navigate=useNavigate()
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
    const [reistrationData, setReistrationData] =useState(null);
    console.log('registration no:', reg_no)
    useEffect(() => {
        let fetchData = async () => {
          try {
            if (reg_no) {
              console.log('in registration get regsitration by reg no api called')
              let { data } = await axios.get(`${baseURL}/api/personal-information/reg_no/${reg_no}`)
              setReistrationData(data?.data)
              console.log('registration data is:', data?.data)
            }
          }
          catch (err) {
    
          }
        }
        fetchData()
    
      }, [])


       useEffect(() => {
       dispatch(getPersonalInformationForm({}));
       dispatch(getStage1({}));
     
    }, [dispatch]);
      
  console.log('registrationData is:', reistrationData)
  let step = searchParams.get("step")
  step=Number(step)
 
    let id=4;
    const wholeForm = useSelector(
        (state) => state?.personalInfoForms?.personalInfoForm?.data
    );
    let stageData= useSelector(
        (state) => state?.stage1?.stage1Data?.data
    );

    const personalFormfields = wholeForm ? wholeForm[0]?.fields : [];
    console.log('user data is:',stageData)

    let initialValues = useMemo(() => {
        if (stageData) return stageData;

        const values = { first_name: "", last_name: "",father_name:"",class:"",division:"",contact_number:"",
            email:"",password:"",dob:"",blood_group:""
         };
        personalFormfields.forEach((elem) => {
            values[elem.name] = "";
        });
        return values;
    }, [personalFormfields]);
    
  initialValues = reistrationData || initialValues;
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

   

    return (
        <div className="container mt-5">
            <FormWizard currentStep={step}/>
            <div className="card p-4 shadow">
                <h3 className="mb-4">Personal Information Form</h3>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                   // validationSchema={validationSchema}
                    onSubmit={async(values, { resetForm }) => {
                            try {
                             let { data } = await axios.put(`${baseURL}/api/personal-information/reg_no/${reg_no}`, values)
                             let formStatusPayload = { current_step: 3, reg_no: reg_no}
                             await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
                             alert("Form updated successfully!")

                            }
                            catch(err){
                                console.log('error is:', err)
                            }
                       navigate('/subject-stage?step=3')
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
                                onClick={() => navigate(`/registration?step=1`) }
                            >
                                Prev
                            </button>
                            <button
                                type="Next"
                                className="btn btn-success mt-3 px-5"
                                disabled={isSubmitting}
                            >
                                Next
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

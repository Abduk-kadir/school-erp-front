import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
import FormWizard from "./FormWizard";
import { useNavigate, useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from "react-redux";
const DeclarationStage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [personalData, setPersonalData] = useState({})
  const [formNo, setFormNo] = useState(345)
  const [classId, setClassid] = useState(7)
  const [declaration, setDeclaration] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [editedDeclaration, setEditedDeclaration] = useState(null)
  const reg_no = useSelector((state) => state?.registrationNo?.reg_no);

  useEffect(() => {
    let fetchData = async () => {
      try {
        let { data } = await axios.get(`${baseURL}/api/declarations/6`)
        setDeclaration(data?.data)
      }
      catch (err) {
        console.log('erro in fetching declaration')
      }

    }
    fetchData()
  }, [])
  useEffect(() => {
    let fetchData = async () => {
      try {

        const results = await Promise.allSettled([
          axios.get(`${baseURL}/api/student-declarations/student/${reg_no}`),
          axios.get(`${baseURL}/api/personal-information/reg_no/${reg_no}`)
        ]);

        if (results[0].status === "fulfilled") {

          setEditedDeclaration(results[0].value?.data?.data)
          setEditMode(true)



        }
        if (results[1].status === "fulfilled") {

          console.log('personal Data**********', results[1].value?.data?.data)
          setPersonalData(results[1].value?.data?.data);
        }
        else{}




      }
      catch (err) {
        console.log('erro in fetching declaration')
      }

    }
    fetchData()
  }, [])
  console.log('edited declaration is:', editedDeclaration)
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('values are:', values)
      if (editMode) {

        await axios.patch(`${baseURL}/api/student-declarations/${editedDeclaration?.id}`, {
          reg_no: values.reg_no,
          declaration_id: declaration?.id,
          accepted: values.accepted,
          date: values.date,
          location: values.place,
        });
        alert('successfully updated declaration');
        navigate(`/document-stage?step=9`);
      } else {
        await axios.post(`${baseURL}/api/student-declarations`, {
          reg_no: values.reg_no,
          declaration_id: declaration?.id,
          accepted: values.accepted,
          date: values.date,
          location: values.place,
        });
        alert('successfully added declaration');
        let formStatusPayload = { current_step: 9, reg_no: reg_no }
        await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
        navigate(`/document-stage?step=9`);
      }

    } catch (err) {
      //alert('not added declaration');
    } finally {
      //setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    place: Yup.string().required('Place is required'),
    date: Yup.date().required('Date is required'),
    accepted: Yup.bool().oneOf([true], 'You must accept the terms'),
  });
  console.log('declaration is:', declaration)
  return (
    <div className="container mt-5">
      <FormWizard currentStep={Number(searchParams.get('step'))} />
      <div className="d-flex justify-content-center">


        <div className="card  border p-10" style={{ width: "95%" }}>

          <div className="d-flex justify-content-between gap-3 ">
            <h6 className="mb-4">Declaration</h6>

            <button
              type="Next"
              className="btn btn-success"
              onClick={() => navigate('/')}

            >
              Logout
            </button>
          </div>
          <div className='row mb-5'>
            <div className='col-3'>
              <label className="form-label">Reg NO</label>
              <input className='form-control' value={reg_no} disabled />
            </div>
            <div className='col-3'>
              <label className="form-label">First Name</label>
              <input className='form-control' value={personalData?.first_name} disabled />

            </div>
            <div className='col-3'>
              <label className="form-label">Last Name</label>
              <input className='form-control' value={personalData?.last_name} disabled />
            </div>
            <div className='col-3'>
              <label className="form-label">Class</label>
              <input className='form-control' value={personalData?.class} disabled />
            </div>
          </div>

          <div className="mt-10" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(declaration?.content || '') }} />

          <Formik
            enableReinitialize={true}
            initialValues={
              {
                reg_no: editedDeclaration?.reg_no || reg_no,
                formNo: editedDeclaration?.formNo || formNo,
                classId: editedDeclaration?.classId || classId,
                place: editedDeclaration?.location || '',
                date: editedDeclaration?.date
                  ? editedDeclaration.date.split('T')[0]
                  : '',
                accepted: editedDeclaration?.accepted || false
              }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <div className="form-check d-flex align-items-center mb-2 border">
                  <Field type="checkbox" name="accepted" className="form-check-input me-2" id="check1" />
                  <label className="form-check-label fw-bold" htmlFor="check1">
                    I accept all terms and conditions for this Institute
                  </label>

                </div>
                <div className="text-danger"><ErrorMessage name="accepted" /></div>

                <div className="row mt-3">
                  <div className="col-6 mb-2">
                    <label className="form-label fw-bold">Place</label>
                    <Field name="place" type="text" className="form-control" />
                    <div className="text-danger"><ErrorMessage name="place" /></div>
                  </div>

                  <div className="col-6">
                    <label className="form-label fw-bold">Date</label>
                    <Field name="date" type="date" className="form-control" />
                    <div className="text-danger"><ErrorMessage name="date" /></div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-3 mb-10">
                  <button
                    type="button"
                    className="btn btn-success mt-3 px-5"
                    onClick={() => navigate(`/other-information-stage?step=7`)}
                  >
                    Prev
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success mt-3 px-5"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? 'Saving...' : 'Next'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>


        </div>

      </div>
    </div>
  );
};

export default DeclarationStage;

import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
import { Formik, Form, ErrorMessage, useFormikContext } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";

const DocumentStage = () => {
  const [docReq, setDocReq] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/requirement-documents`, {
          params: { class_id: 4 },
        });
        setDocReq(res.data.data || []);
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchData();
  }, []);

  // Remove duplicates and prepare unique document types
  const uniqueDocs = Array.from(
    new Map(docReq.map((item) => [item.document_type, item])).values()
  );

  // initialValues: { "Aadhaar Card": "", "Pan Card": "", ... }
  const initialValues = uniqueDocs.reduce((acc, curr) => {
    acc[curr.document_type] = ""; // or null — doesn't matter much for files
    return acc;
  }, {});

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      // Append each file
      Object.entries(values).forEach(([docType, file]) => {
        if (file) {
          formData.append(docType, file); // or use a fixed field name if backend expects it
        }
      });

      // Optional: also send class_id or other metadata
      // formData.append("class_id", "4");

      const response = await axios.post(
        `${baseURL}/api/upload-documents`, // ← change to your real endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", response.data);
      alert("Documents uploaded successfully!");
      resetForm();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 card p-4 shadow ">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, isSubmitting, values }) => (
          <Form>
            {uniqueDocs.map((elem) => (
              <div key={elem.id || elem.document_type} className="row mb-5 gap-3">

                <div className="col-12 col-md-2">
                  <label className="form-label fs-5 fw-semibold mb-0">
                    Upload {elem.document_type}
                    {elem.is_mandatory && <span className="text-danger"> *</span>}
                  </label>
                </div>

                <div className="col-12 col-md-3 ">
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.jpg,.jpeg,.png" // ← adjust as needed

                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      setFieldValue(elem.document_type, file || null);
                    }}
                  />
                </div>
                <div className="col-12 col-md-3 ">

                  <label
                    htmlFor='basic-upload'
                    className='border border-primary-600 fw-medium text-primary-600 px-16 py-10 radius-12 d-inline-flex align-items-center gap-2 bg-hover-primary-50'
                  >
                    <Icon icon='solar:upload-linear' className='text-xl' />
                    Click to upload
                  </label>
                </div>




              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Submit Documents"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DocumentStage;
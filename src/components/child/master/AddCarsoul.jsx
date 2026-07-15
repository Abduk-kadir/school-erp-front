import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/declaration.css";

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  heading: Yup.string().trim().required("Heading is required"),
  subheading: Yup.string().trim().required("Subheading is required"),
  images: Yup.array()
    .min(1, "At least one image is required")
    .required("Images are required"),
});

const ImagePreviewGrid = ({ images, onRemove }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  if (previews.length === 0) return null;

  return (
    <div className="school-photos-preview-grid">
      {previews.map((src, index) => (
        <div key={`${src}-${index}`} className="school-photo-preview-item">
          <img
            src={src}
            alt={`Preview ${index + 1}`}
            className="school-photo-preview-img"
          />
          <button
            type="button"
            className="school-photo-remove-btn"
            aria-label="Remove image"
            onClick={() => onRemove(index)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

const AddCarsoul = () => {
  return (
    <div className="chfi-wrapper declaration-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:gallery-wide-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Carousel</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area declaration-form-area">
            <Formik
              initialValues={{
                title: "",
                heading: "",
                subheading: "",
                images: [],
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const formData = new FormData();
                  formData.append("title", values.title);
                  formData.append("heading", values.heading);
                  formData.append("subheading", values.subheading);
                  values.images.forEach((file) => {
                    formData.append("images", file);
                  });

                  await axios.post(`${baseURL}/api/carsoul`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });

                  alert("Carousel saved successfully");
                  resetForm();
                } catch (err) {
                  console.error("Carousel save failed:", err);
                  alert(err?.response?.data?.message || err?.message);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, setFieldValue, isSubmitting, resetForm }) => (
                <Form className="chfi-root" encType="multipart/form-data">
                  <div className="school-photos-section">
                    <div className="field-row">
                      <label className="form-label" htmlFor="carsoul-images">
                        <span className="label-dot" />
                        Images
                      </label>
                      <div className="icon-field">
                        <span className="icon">
                          <Icon icon="solar:gallery-bold-duotone" width="18" />
                        </span>
                        <input
                          id="carsoul-images"
                          type="file"
                          className="form-control"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (!files.length) return;
                            setFieldValue("images", [
                              ...values.images,
                              ...files,
                            ]);
                            e.target.value = "";
                          }}
                        />
                      </div>
                      <ErrorMessage
                        name="images"
                        component="div"
                        className="text-danger field-error"
                      />
                    </div>
                    <p className="school-photos-hint">
                      Select one or more images for the carousel.
                    </p>

                    <ImagePreviewGrid
                      images={values.images}
                      onRemove={(index) =>
                        setFieldValue(
                          "images",
                          values.images.filter((_, i) => i !== index)
                        )
                      }
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label" htmlFor="carsoul-title">
                      <span className="label-dot" />
                      Title
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:text-bold-duotone" width="18" />
                      </span>
                      <Field
                        id="carsoul-title"
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Enter title"
                      />
                    </div>
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label" htmlFor="carsoul-heading">
                      <span className="label-dot" />
                      Heading
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:text-field-bold-duotone" width="18" />
                      </span>
                      <Field
                        id="carsoul-heading"
                        type="text"
                        name="heading"
                        className="form-control"
                        placeholder="Enter heading"
                      />
                    </div>
                    <ErrorMessage
                      name="heading"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label" htmlFor="carsoul-subheading">
                      <span className="label-dot" />
                      Subheading
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon
                          icon="solar:text-square-bold-duotone"
                          width="18"
                        />
                      </span>
                      <Field
                        id="carsoul-subheading"
                        type="text"
                        name="subheading"
                        className="form-control"
                        placeholder="Enter subheading"
                      />
                    </div>
                    <ErrorMessage
                      name="subheading"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-reset"
                      onClick={() => resetForm()}
                      disabled={isSubmitting}
                    >
                      <Icon icon="solar:restart-bold-duotone" width="16" />
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Icon icon="line-md:loading-loop" width="16" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Icon
                            icon="solar:check-circle-bold-duotone"
                            width="18"
                          />
                          Save Carousel
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCarsoul;

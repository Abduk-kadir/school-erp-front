import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import '../../../assets/css/mastercom.css';

const fieldIcons = {
  batch: 'solar:diploma-bold-duotone',
  class: 'solar:square-academic-cap-bold-duotone',
  division: 'solar:widget-bold-duotone',
  subject: 'solar:book-bold-duotone',
  topic: 'solar:document-text-bold-duotone',
  uploadNotes: 'solar:upload-bold-duotone',
  chapter: 'solar:bookmark-bold-duotone',
  url: 'solar:link-bold-duotone',
  submissionDate: 'solar:calendar-bold-duotone',
  submissiontime: 'solar:clock-circle-bold-duotone',
  title: 'solar:text-bold-duotone',
  assignmentfile: 'solar:file-bold-duotone',
  validFrom: 'solar:calendar-bold-duotone',
  timtablefile: 'solar:calendar-minimalistic-bold-duotone',
};
const dummyBatches = [
  { label: "Batch 2024", value: "2024" },
  { label: "Batch 2025", value: "2025" },
  { label: "Batch 2026", value: "2026" },
];

const dummyClasses = [
  { label: "Class 1", value: "1" },
  { label: "Class 2", value: "2" },
  { label: "Class 3", value: "3" },
];

const dummyDivisions = [
  { label: "Division A", value: "a" },
  { label: "Division B", value: "b" },
  { label: "Division C", value: "c" },
];

const dummySubjects = [
  { label: "Mathematics", value: "math" },
  { label: "Science", value: "science" },
  { label: "English", value: "english" },
];

const formConfigs = {
  notes: {
    title: "Send Notes",
    submitButtonText: "Send",
    fields: [
      {
        name: "class",
        label: "Class",
        type: "select",
        required: true,
        options: dummyClasses,
      },
      {
        name: "division",
        label: "Division",
        type: "select",
        required: true,
        options: dummyDivisions,
      },
      {
        name: "subject",
        label: "Subject",
        type: "select",
        required: true,
        options: dummySubjects,
      },
      { name: "topic", label: "Topic", type: "text", required: true },
      { name: "uploadNotes", label: "Upload Notes", type: "file", required: true },
      { name: "chapter", label: "Chapter", type: "text" },
      { name: "url", label: "URL", type: "text" },
    ],
  },

  assignment: {
    title: "Send Assignment",
    submitButtonText: "Send",
    fields: [
      {
        name: "batch",
        label: "Batch",
        type: "select",
        required: true,
        options: dummyBatches,
      },
      {
        name: "class",
        label: "Class",
        type: "select",
        required: true,
        options: dummyClasses,
      },
      {
        name: "division",
        label: "Division",
        type: "select",
        required: true,
        options: dummyDivisions,
      },
      {
        name: "subject",
        label: "Subject",
        type: "select",
        required: true,
        options: dummySubjects,
      },
      { name: "submissionDate", label: "Submission Date", type: "date", required: true },
      { name: "submissiontime", label: "Submission Time", type: "time", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "assignmentfile", label: "Assignment File", type: "file", required: true },
    ],
  },

  timetable: {
    title: "Send Time Table",
    submitButtonText: "Send",
    fields: [
      {
        name: "batch",
        label: "Batch",
        type: "select",
        required: true,
        options: dummyBatches,
      },
      {
        name: "class",
        label: "Class",
        type: "select",
        required: true,
        options: dummyClasses,
      },
      {
        name: "division",
        label: "Division",
        type: "select",
        required: true,
        options: dummyDivisions,
      },
      { name: "validFrom", label: "Valid From", type: "date", required: true },
      { name: "timtablefile", label: "Time Table File", type: "file", required: true },
    ],
  },
};

// Generate validation schema dynamically
const generateValidationSchema = (fields) => {
  const schema = {};

  fields.forEach((field) => {
    let validator =
      field.type === 'file'
        ? Yup.mixed().nullable()
        : field.type === 'date'
          ? Yup.date()
          : Yup.string();

    if (field.type === 'email') {
      validator = Yup.string().email("Invalid email");
    }
    if (field.required) {
      validator = validator.required(`${field.label} is required`);
    }

    schema[field.name] = validator;
  });

  return Yup.object().shape(schema);
};

const generateInitialValues = (fields, overrides = {}) => {
  const defaults = {};
  fields.forEach((field) => {
    defaults[field.name] = field.type === 'file' ? null : '';
  });
  return { ...defaults, ...overrides };
};

const CommonSendDataStudent = ({ formType, initialValues = {}, onSubmit = () => {} }) => {

  const config = formConfigs[formType];

  if (!config) {
    return (
      <div className="chfi-wrapper mb-3">
        <div className="chfi-card">
          <div className="card-body">
            <p className="text-danger mb-0">Invalid form type: {formType}</p>
          </div>
        </div>
      </div>
    );
  }

  const validationSchema = generateValidationSchema(config.fields);
  const mergedInitialValues = generateInitialValues(config.fields, initialValues);

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <div>
              <h5 className="card-title">{config.title}</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area">
          <Formik
            initialValues={mergedInitialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="chfi-root">
                {config.fields.map((field) => {
                  const icon = field.icon || fieldIcons[field.name] || 'solar:document-bold-duotone';

                  const renderInput = () => {
                    if (field.type === 'textarea') {
                      return (
                        <Field
                          as="textarea"
                          name={field.name}
                          placeholder={field.placeholder}
                          rows={4}
                          className="form-control"
                        />
                      );
                    }
                    if (field.type === 'select') {
                      return (
                        <Field as="select" name={field.name} className="form-select">
                          <option value="">Select {field.label}</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Field>
                      );
                    }
                    if (field.type === 'file') {
                      return (
                        <input
                          type="file"
                          name={field.name}
                          className="form-control"
                          onChange={(e) =>
                            setFieldValue(field.name, e.currentTarget.files[0] || null)
                          }
                        />
                      );
                    }
                    return (
                      <Field
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="form-control"
                      />
                    );
                  };

                  return (
                  <div className="field-row" key={field.name}>
                    <label className="form-label">
                      <span className="label-dot" />
                      {field.label}
                      {field.required && <span className="text-danger"> *</span>}
                    </label>

                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon={icon} width="18" />
                      </span>
                      {renderInput()}
                    </div>

                    <ErrorMessage
                      name={field.name}
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>
                  );
                })}

                <div className="actions d-flex justify-content-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-submit d-inline-flex align-items-center gap-2"
                  >
                    {isSubmitting ? "Processing..." : config.submitButtonText}
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

export default CommonSendDataStudent;
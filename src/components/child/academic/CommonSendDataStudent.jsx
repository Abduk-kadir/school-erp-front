import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
import Loader from '../../../helper/Loader';
import '../../../assets/css/mastercom.css';
import {useDispatch,useSelector} from "react-redux";
import { getStaffData } from "../../../redux/slices/registrationNo";
const fieldIcons = {
  batch: 'solar:diploma-bold-duotone',
  classId: 'solar:square-academic-cap-bold-duotone',
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

const formConfigs = {
  notes: {
    title: "Send Notes",
    submitButtonText: "Send",
    submitUrl: "/api/notes",
    fields: [
      {
        name: "batch",
        label: "Batch",
        type: "select",
        required: true,
      },
      {
        name: "classId",
        label: "Class",
        type: "select",
        required: true,
      },
      {
        name: "division",
        label: "Division",
        type: "select",
        required: true,
      },
      {
        name: "subject",
        label: "Subject",
        type: "select",
        required: true,
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
    submitUrl: "/api/assignments",
    fields: [
      {
        name: "batch",
        label: "Batch",
        type: "select",
        required: true,
      },
      {
        name: "classId",
        label: "Class",
        type: "select",
        required: true,
      },
      {
        name: "division",
        label: "Division",
        type: "select",
        required: true,
      },
      {
        name: "subject",
        label: "Subject",
        type: "select",
        required: true,
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
    submitUrl: "/api/timetables",
    fields: [
      {
        name: "batch",
        label: "Batch",
        type: "select",
        required: true,
      },
      {
        name: "classId",
        label: "Class",
        type: "select",
        required: true,
      },
      {
        name: "division",
        label: "Division",
        type: "select",
        required: true,
      },
      { name: "validFrom", label: "Valid From", type: "date", required: true },
      { name: "timtablefile", label: "Time Table File", type: "file", required: true },
    ],
  },
};

const getOptionLabel = (fieldName, item) => {
  if (fieldName === 'batch') return item?.batch_name ?? item?.name ?? item?.title ?? '';
  if (fieldName === 'classId') return item?.class_name ?? item?.name ?? '';
  if (fieldName === 'division') return item?.division_name ?? item?.name ?? '';
  if (fieldName === 'subject') return item?.subject_name ?? item?.name ?? item?.value ?? '';
  return item?.name ?? '';
};

const getDropdownOptions = (fieldName, { batches, classes, divisions, subjects }) => {
  const dataMap = {
    batch: batches,
    classId: classes,
    division: divisions,
    subject: subjects,
  };
  const list = dataMap[fieldName] || [];
  return list.map((item) => ({
    value: item?.id ?? '',
    label: getOptionLabel(fieldName, item),
  }));
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

const buildFormData = (formType, values, staffId) => {
  const formData = new FormData();

  if (formType === 'notes') {
    formData.append('batchId', values.batch);
    formData.append('classId', values.classId);
    formData.append('division', values.division);
    formData.append('subject', values.subject);
    formData.append('topic', values.topic);
    formData.append('staffid', staffId);
    if (values.uploadNotes) {
      formData.append('notes', values.uploadNotes);
    }
    if (values.chapter) {
      formData.append('chapter', values.chapter);
    }
    if (values.url) {
      formData.append('url', values.url);
    }
    return formData;
  }

  if (formType === 'assignment') {
    formData.append('batchId', values.batch);
    formData.append('classId', values.classId);
    formData.append('division', values.division);
    formData.append('subject', values.subject);
    formData.append('submission_date', values.submissionDate);
    formData.append('submission_time', values.submissiontime);
    formData.append('title', values.title);
    formData.append('staffid', staffId);
    if (values.assignmentfile) {
      formData.append('assignment', values.assignmentfile);
    }
    return formData;
  }

  if (formType === 'timetable') {
    formData.append('batchId', values.batch);
    formData.append('classId', values.classId);
    formData.append('division', values.division);
    formData.append('valid_from', values.validFrom);
    formData.append('staffid', staffId);
    if (values.timtablefile) {
      formData.append('timetable', values.timtablefile);
    }
    return formData;
  }

  return formData;
};

const getApiMessage = (payload) => {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  return (
    payload.message ||
    payload.error ||
    payload.msg ||
    payload.data?.message ||
    ''
  );
};

const parseProgramSubjects = (payload) => {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const subjectMap = new Map();
  list.forEach((item) => {
    const subject = item?.subject;
    if (subject?.id && !subjectMap.has(subject.id)) {
      subjectMap.set(subject.id, subject);
    }
  });
  return Array.from(subjectMap.values());
};

const fileFieldsByFormType = {
  notes: ['uploadNotes'],
  assignment: ['assignmentfile'],
  timetable: ['timtablefile'],
};

const CommonSendDataStudent = ({ formType, initialValues = {}, onSubmit }) => {
  const [batches,setBatches]=useState([])
  const [classes,setClasses]=useState([])
  const [divisions,setDivisions]=useState([])
  const [batchmasters,setBatchmasters]=useState([])
  const [subjects,setSubjects]=useState([])
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const config = formConfigs[formType];
  const staff = useSelector((state) => state.registrationNo.staff?.data);
  const staffid = staff?.id;

  const dispatch=useDispatch();

  useEffect(()=>{
    console.log('calling use effect in dashboard admin')
    const token=localStorage.getItem('token');
    console.log('token**********************:',token)
    if(!staffid){
      dispatch(getStaffData({token:token}))
    }
    console.log("end")
  },[])




  const handleFormSubmit = async (values, { setSubmitting, resetForm, setFieldValue }) => {
    if (onSubmit) {
      await onSubmit(values, { setSubmitting, resetForm, setFieldValue });
      return;
    }

    if (!config?.submitUrl) return;

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSubmitting(true);
      const formData = buildFormData(formType, values, staffid);

      const res = await axios.post(`${baseURL}${config.submitUrl}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg(getApiMessage(res?.data) || 'Saved successfully');
      resetForm({ values: generateInitialValues(config.fields, initialValues) });
      (fileFieldsByFormType[formType] || []).forEach((fieldName) => {
        setFieldValue(fieldName, null);
      });
    } catch (error) {
      console.error(`Save ${formType} failed:`, error);
      const msg =
        getApiMessage(error.response?.data) ||
        error.message ||
        'Failed to save. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/batches`);
        setBatches(res?.data?.data || res?.data || []);
      } catch (error) {
        console.error('Failed to fetch batches', error);
      }
    };
    fetchData();
  }, []);

  const fetchBatchRelations = async (batchId, setFieldValue) => {
    setFieldValue('classId', '');
    setFieldValue('division', '');
    setFieldValue('subject', '');
    setClasses([]);
    setDivisions([]);
    setSubjects([]);

    if (!batchId) return;

    try {
      const res = await axios.get(`${baseURL}/api/batches/${batchId}/relations`);
      const data = res?.data;
      setClasses(data?.class || []);
      setDivisions(data?.division || []);
    } catch (error) {
      console.error('Failed to fetch batch relations', error);
    }
  };

  const fetchClassSubjects = async (classId, setFieldValue) => {
    setFieldValue('subject', '');
    setSubjects([]);

    if (!classId) return;

    try {
      const res = await axios.get(
        `${baseURL}/api/program-subjects?classId=${classId}`
      );
      setSubjects(parseProgramSubjects(res?.data));
    } catch (error) {
      console.error('Failed to fetch program subjects', error);
    }
  };

  const hasSubjectField = config?.fields?.some((f) => f.name === 'subject');
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
          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMsg}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMsg('')}
              />
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrorMsg('')}
              />
            </div>
          )}

          <div className="form-area">
          <Formik
            initialValues={mergedInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="chfi-root">
                {loading && <Loader message={`Saving ${config.title.trim()}...`} />}
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
                      const options = getDropdownOptions(field.name, {
                        batches,
                        classes,
                        divisions,
                        subjects,
                      });

                      if (field.name === 'batch') {
                        return (
                          <Field
                            as="select"
                            name={field.name}
                            className="form-select"
                            onChange={(e) => {
                              const batchId = e.target.value;
                              setFieldValue('batch', batchId);
                              fetchBatchRelations(batchId, setFieldValue);
                            }}
                          >
                            <option value="">Select {field.label}</option>
                            {options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Field>
                        );
                      }

                      if (field.name === 'classId') {
                        return (
                          <Field name="classId">
                            {({ field: formikField, form }) => (
                              <select
                                {...formikField}
                                className="form-select"
                                disabled={!values.batch}
                                onChange={(e) => {
                                  const classId = e.target.value;
                                  form.setFieldValue('classId', classId);
                                  if (hasSubjectField) {
                                    fetchClassSubjects(classId, form.setFieldValue);
                                  }
                                }}
                              >
                                <option value="">Select {field.label}</option>
                                {options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </Field>
                        );
                      }

                      const isClassOrDivision = field.name === 'classId' || field.name === 'division';
                      const isSubject = field.name === 'subject';
                      return (
                        <Field
                          as="select"
                          name={field.name}
                          className="form-select"
                          disabled={
                            (isClassOrDivision && !values.batch) ||
                            (isSubject && !values.classId)
                          }
                        >
                          <option value="">Select {field.label}</option>
                          {options.map((opt) => (
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
                    disabled={isSubmitting || loading}
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
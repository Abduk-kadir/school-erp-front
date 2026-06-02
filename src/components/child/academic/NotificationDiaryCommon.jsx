import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
import { Icon } from '@iconify/react/dist/iconify.js';
import '../../../assets/css/mastercom.css';

const validationSchema = Yup.object({
  message: Yup.string().required('Message is required'),
  document: Yup.mixed()
    .nullable()
    .test('fileSize', 'File size must be 1 MB or less', (value) =>
      !value || value.size <= 1024 * 1024
    )
    .test('fileType', 'Only PDF or JPG files are allowed', (value) =>
      !value || ['application/pdf', 'image/jpeg', 'image/jpg'].includes(value.type)
    ),
});

const initialValues = {
  message: '',
  document: null,
  batches: [],
  classes: [],
  divisions: [],
  staffGroup: '',
  subject: '',
};

const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getOptionId = (item) => item?.id ?? item?._id ?? '';

const NotificationDiaryCommon = ({isSubject=false}) => {
  const [activeTab, setActiveTab] = useState('student');
  const [batchOptions, setBatchOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [staffGroupOptions, setStaffGroupOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [batchRes, staffGroupRes, subjectRes] = await Promise.allSettled([
        axios.get(`${baseURL}/api/batches`),
        axios.get(`${baseURL}/api/staff-groups`),
        axios.get(`${baseURL}/api/subjects`),
      ]);

      if (batchRes.status === 'fulfilled') {
        setBatchOptions(normalizeListResponse(batchRes.value));
      }
      if (staffGroupRes.status === 'fulfilled') {
        setStaffGroupOptions(normalizeListResponse(staffGroupRes.value));
      }
      if (subjectRes.status === 'fulfilled') {
        setSubjectOptions(normalizeListResponse(subjectRes.value));
      }
    };
    fetchOptions();
  }, []);

  const fetchBatchRelations = async (batchIds, setFieldValue) => {
    setFieldValue('classes', []);
    setFieldValue('divisions', []);
    setClassOptions([]);
    setDivisionOptions([]);

    const ids = (batchIds || []).filter(Boolean);
    if (!ids.length) return;

    try {
      const results = await Promise.all(
        ids.map((id) => axios.get(`${baseURL}/api/batches/${id}/relations`))
      );
      const classMap = new Map();
      const divisionMap = new Map();
      results.forEach((res) => {
        (res?.data?.class || []).forEach((item) => {
          classMap.set(getOptionId(item), item);
        });
        (res?.data?.division || []).forEach((item) => {
          divisionMap.set(getOptionId(item), item);
        });
      });
      setClassOptions(Array.from(classMap.values()));
      setDivisionOptions(Array.from(divisionMap.values()));
    } catch (error) {
      console.error('Failed to fetch batch relations', error);
    }
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('message', values.message);
    formData.append('document', values.document);
    // axios.post(`${baseURL}/api/notification-diary`, formData);
  };

  const staffView = () => (
    <div className="chfi-root d-flex flex-column gap-3">
      <div>
        <label className="form-label mb-1">
          <span className="label-dot" />
          Staff Group
        </label>
        <div className="icon-field">
          <span className="icon">
            <Icon icon="solar:users-group-rounded-bold-duotone" width="16" />
          </span>
          <Field as="select" name="staffGroup" className="form-select">
            <option value="">Select Staff Group</option>
            {staffGroupOptions.map((g) => (
              <option key={g?.id} value={g?.id ?? ''}>
                {g?.group_name ?? g?.name}
              </option>
            ))}
          </Field>
        </div>
      </div>
    </div>
  );

  const MultiChipSelect = ({
    label,
    fieldName,
    options,
    optionLabel,
    values,
    setFieldValue,
    disabled = false,
    onSelectionChange,
  }) => {
    const selected = (values[fieldName] || []).filter(Boolean).map(String);
    const available = options.filter(
      (o) => !selected.includes(String(getOptionId(o)))
    );

    const handleAdd = (e) => {
      const val = e.target.value;
      if (!val || selected.includes(String(val))) return;
      const nextSelected = [...selected, String(val)];
      setFieldValue(fieldName, nextSelected);
      e.target.value = '';
      onSelectionChange?.(nextSelected);
    };

    const handleRemove = (val) => {
      const nextSelected = selected.filter((v) => v !== val);
      setFieldValue(fieldName, nextSelected);
      onSelectionChange?.(nextSelected);
    };

    const getLabel = (id) => {
      const opt = options.find((o) => String(getOptionId(o)) === String(id));
      return opt ? optionLabel(opt) : id;
    };

    return (
      <div>
        <label className="form-label mb-1">
          <span className="label-dot" />
          {label}
        </label>
        <div className="chip-select-box">
          {selected.map((val) => (
            <span className="chip-item" key={val}>
              {getLabel(val)}
              <button type="button" className="chip-remove" onClick={() => handleRemove(val)}>
                <Icon icon="solar:close-square-bold" width="14" />
              </button>
            </span>
          ))}
          <select
            className="chip-select-input"
            onChange={handleAdd}
            value=""
            disabled={disabled}
          >
            <option value="">+ Select {label}</option>
            {available.map((o) => (
              <option key={getOptionId(o)} value={getOptionId(o)}>
                {optionLabel(o)}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const studentView = (values, setFieldValue) => (
    <div className="chfi-root d-flex flex-column gap-3">
      <MultiChipSelect
        label="Batch"
        fieldName="batches"
        options={batchOptions}
        optionLabel={(b) => b?.batch_name ?? b?.name ?? b?.title}
        values={values}
        setFieldValue={setFieldValue}
        onSelectionChange={(batchIds) => fetchBatchRelations(batchIds, setFieldValue)}
      />
      <MultiChipSelect
        label="Class"
        fieldName="classes"
        options={classOptions}
        optionLabel={(c) => c?.class_name ?? c?.name}
        values={values}
        setFieldValue={setFieldValue}
        disabled={!values.batches?.length}
      />
      <MultiChipSelect
        label="Division"
        fieldName="divisions"
        options={divisionOptions}
        optionLabel={(d) => d?.division_name ?? d?.name}
        values={values}
        setFieldValue={setFieldValue}
        disabled={!values.batches?.length}
      />
      {isSubject && (
        <div>
          <label className="form-label mb-1">
            <span className="label-dot" />
            Subject
          </label>
          <div className="icon-field">
            <span className="icon">
              <Icon icon="solar:book-bold-duotone" width="16" />
            </span>
            <Field as="select" name="subject" className="form-select">
              <option value="">Select Subject</option>
              {subjectOptions.map((s) => (
                <option key={s?.id} value={s?.id ?? ''}>
                  {s?.subject_name ?? s?.name ?? s?.value}
                </option>
              ))}
            </Field>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:bell-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Send Notification</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area">
          <div className="chfi-root d-flex gap-2 mb-3">
            <button
              type="button"
              className={activeTab === 'student' ? 'btn-submit' : 'btn-reset'}
              onClick={() => setActiveTab('student')}
            >
              <Icon icon="solar:user-bold-duotone" width="15" />
              Student
            </button>
            <button
              type="button"
              className={activeTab === 'staff' ? 'btn-submit' : 'btn-reset'}
              onClick={() => setActiveTab('staff')}
            >
              <Icon icon="solar:user-id-bold-duotone" width="15" />
              Staff
            </button>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="chfi-root d-flex flex-column gap-3">

                <div>
                  {activeTab === 'student' ? studentView(values, setFieldValue) : staffView()}
                </div>

                <div>
                  <label className="form-label mb-1">
                    <span className="label-dot" />
                    Message <span className="text-danger">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="message"
                    rows={5}
                    className="form-control"
                    placeholder="Enter notification message..."
                  />
                  <div style={{ minHeight: '1.25rem' }}>
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label mb-1">
                    <span className="label-dot" />
                    Document <span className="text-muted fw-normal">( Upload PDF or JPG. Maximum file size: 1 MB. )</span>
                  </label>
                  <input
                    type="file"
                    name="document"
                    className="form-control"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) =>
                      setFieldValue('document', e.currentTarget.files[0] || null)
                    }
                  />
                  <div style={{ minHeight: '1.25rem' }}>
                    <ErrorMessage
                      name="document"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-submit d-inline-flex align-items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Icon icon="line-md:loading-loop" width="16" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Icon icon="solar:plain-bold-duotone" width="18" />
                        Send
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

export default NotificationDiaryCommon;

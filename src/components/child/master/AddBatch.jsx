import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
import Loader from '../../../helper/Loader';
import '../../../assets/css/mastercom.css';

const initialValues = {
  batch_name: '',
  classes: [],
  divisions: [],
  starttime: '',
  endtime: '',
  personname: '',
  contactperson: '',
};

const validationSchema = Yup.object({
  batch_name: Yup.string()
    .trim()
    .required('Batch name is required')
    .min(2, 'Minimum 2 characters'),
  classes: Yup.array().min(1, 'Class is required'),
  
  starttime: Yup.string().required('Start time is required'),
  endtime: Yup.string().required('End time is required'),
  
  contactperson: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit contact number'),
});

const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const formatTimeForApi = (time) => {
  if (!time) return time;
  return time.length === 5 ? `${time}:00` : time;
};

const getOptionId = (item) => item?.optionId ?? item?.id ?? item?._id ?? '';

const buildOptionsFromMappings = (mappings) => {
  const classMap = new Map();
  const divisionOptions = [];

  mappings.forEach((row) => {
    const classId = row?.classid ?? row?.classInfo?.id;
    const divisionId = row?.divisionid ?? row?.divisionInfo?.id;
    if (!classId || !divisionId) return;

    const className = row?.classInfo?.class_name ?? '';
    const divisionName = row?.divisionInfo?.division_name ?? '';

    if (!classMap.has(classId)) {
      classMap.set(classId, {
        id: classId,
        class_name: className,
        class_code: row?.classInfo?.class_code ?? '',
        optionId: String(classId),
      });
    }

    divisionOptions.push({
      classId,
      divisionId,
      class_name: className,
      division_name: divisionName,
      optionId: `${classId}-${divisionId}`,
    });
  });

  return {
    classOptions: Array.from(classMap.values()),
    divisionOptions,
  };
};

const getApiMessage = (payload) => {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  return payload.message || payload.error || payload.msg || payload.data?.message || '';
};

const MultiChipSelect = ({
  fieldName,
  options,
  optionLabel,
  values,
  setFieldValue,
  placeholder,
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
        <option value="">{placeholder}</option>
        {available.map((o) => (
          <option key={getOptionId(o)} value={getOptionId(o)}>
            {optionLabel(o)}
          </option>
        ))}
      </select>
    </div>
  );
};

const AddBatch = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [classOptions, setClassOptions] = useState([]);
  const [allDivisionOptions, setAllDivisionOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/class-div-map-masters`);
        const mappings = normalizeListResponse(res);
        const { classOptions: classes, divisionOptions } =
          buildOptionsFromMappings(mappings);
        setClassOptions(classes);
        setAllDivisionOptions(divisionOptions);
      } catch (error) {
        console.error('Failed to fetch class-division mappings', error);
      }
    };
    fetchOptions();
  }, []);

  const handleClassSelectionChange = (selectedClassIds, setFieldValue, values) => {
    const selected = selectedClassIds.map(String);
    const validDivisions = (values.divisions || []).filter((key) =>
      selected.includes(String(key).split('-')[0])
    );
    setFieldValue('divisions', validDivisions);
  };

  const buildBatchmasters = (classIds, divisionKeys) => {
    const masters = divisionKeys.map((key) => {
      const [classId, divisionId] = String(key).split('-');
      return {
        classId: Number(classId),
        divisionId: Number(divisionId),
      };
    });

    const classIdsWithDivision = new Set(
      masters.map((entry) => String(entry.classId))
    );

    (classIds || []).filter(Boolean).forEach((classId) => {
      if (!classIdsWithDivision.has(String(classId))) {
        masters.push({
          classId: Number(classId),
          divisionId: null,
        });
      }
    });

    return masters;
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);
    setMessage('Saving batch...');
    setSuccessMsg('');
    setErrorMsg('');

    const classIds = values.classes.filter(Boolean);
    const divisionKeys = values.divisions.filter(Boolean);

    const payload = {
      batch_name: values.batch_name.trim(),
      starttime: formatTimeForApi(values.starttime),
      endtime: formatTimeForApi(values.endtime),
      personname: values.personname.trim(),
      contactperson: values.contactperson.trim(),
      batchmasters: buildBatchmasters(classIds, divisionKeys),
    };

    try {
      setSubmitting(true);
      const res = await axios.post(`${baseURL}/api/batches`, payload);
      setSuccessMsg(getApiMessage(res?.data) || 'Batch saved successfully');
      resetForm();
    } catch (error) {
      console.error('Failed to save batch:', error);
      const msg =
        getApiMessage(error.response?.data) ||
        error.message ||
        'Failed to save batch. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:diploma-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Batch</h5>
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
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, resetForm, setFieldValue, values }) => {
                const selectedClassIds = (values.classes || []).map(String);
                const filteredDivisionOptions = allDivisionOptions.filter((o) =>
                  selectedClassIds.includes(String(o.classId))
                );

                return (
                <Form className="chfi-root">
                  {loading && <Loader message={message} />}

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Batch Name
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:notebook-bookmark-bold-duotone" width="18" />
                      </span>
                      <Field
                        type="text"
                        name="batch_name"
                        className="form-control"
                        placeholder="e.g. 2026-27"
                      />
                    </div>
                    <ErrorMessage
                      name="batch_name"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Class
                    </label>
                    <MultiChipSelect
                      fieldName="classes"
                      options={classOptions}
                      optionLabel={(c) => c?.class_name ?? c?.name}
                      values={values}
                      setFieldValue={setFieldValue}
                      placeholder="+ Select Class"
                      onSelectionChange={(classIds) =>
                        handleClassSelectionChange(classIds, setFieldValue, values)
                      }
                    />
                    <ErrorMessage
                      name="classes"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Division
                    </label>
                    <MultiChipSelect
                      fieldName="divisions"
                      options={filteredDivisionOptions}
                      optionLabel={(d) => {
                        const className = d?.class_name ?? '';
                        const divisionName = d?.division_name ?? d?.name ?? '';
                        return className
                          ? `${className} - ${divisionName}`
                          : divisionName;
                      }}
                      values={values}
                      setFieldValue={setFieldValue}
                      placeholder="+ Select Division"
                      disabled={!values.classes?.length}
                    />
                    <ErrorMessage
                      name="divisions"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Start Time
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:clock-circle-bold-duotone" width="18" />
                      </span>
                      <Field type="time" name="starttime" className="form-control" step="1" />
                    </div>
                    <ErrorMessage
                      name="starttime"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      End Time
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:clock-circle-bold-duotone" width="18" />
                      </span>
                      <Field type="time" name="endtime" className="form-control" step="1" />
                    </div>
                    <ErrorMessage
                      name="endtime"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Emergency Contact Person 
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:user-bold-duotone" width="18" />
                      </span>
                      <Field
                        type="text"
                        name="personname"
                        className="form-control"
                        placeholder="e.g. Mr. Sharma"
                      />
                    </div>
                    <ErrorMessage
                      name="personname"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Emergency Contact Number
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:phone-bold-duotone" width="18" />
                      </span>
                      <Field
                        type="text"
                        name="contactperson"
                        className="form-control"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    <ErrorMessage
                      name="contactperson"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-reset"
                      onClick={() => resetForm()}
                      disabled={isSubmitting || loading}
                    >
                      <Icon icon="solar:restart-bold-duotone" width="16" />
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? (
                        <>
                          <Icon icon="line-md:loading-loop" width="16" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:check-circle-bold-duotone" width="18" />
                          Save Batch
                        </>
                      )}
                    </button>
                  </div>
                </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBatch;

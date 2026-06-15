import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
import { Icon } from '@iconify/react/dist/iconify.js';
import Loader from '../../../helper/Loader';
import '../../../assets/css/mastercom.css';

const getInitialValues = (fieldName) => ({
  [fieldName]: '',
  date: '',
  batches: [],
  classes: [],
  divisions: [],
});

const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getOptionId = (item) => item?.optionId ?? item?.id ?? item?._id ?? '';

const getRawId = (item) => item?.id ?? item?._id ?? '';

const buildSubmitTargets = (
  selectedDivisionKeys,
  divisionOptions,
  fieldName,
  nameValue,
  date
) =>
  selectedDivisionKeys
    .map((key) =>
      divisionOptions.find((o) => String(getOptionId(o)) === String(key))
    )
    .filter(Boolean)
    .map((o) => ({
      batch: Number(o.batchId),
      class: Number(o.classId),
      division: Number(getRawId(o)),
      date,
      [fieldName]: nameValue,
    }));

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

const HolidayEventCommon = ({
  title = 'Send Notification',
  icon = 'solar:bell-bold-duotone',
  nameLabel = 'Name',
  saveUrl,
}) => {
  const fieldName = nameLabel.toLowerCase();
  const initialValues = getInitialValues(fieldName);
  const validationSchema = Yup.object({
    [fieldName]: Yup.string()
      .trim()
      .required(`${nameLabel} is required`),
    date: Yup.string().required('Date is required'),
  });
  const [batchOptions, setBatchOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const batchRes = await axios.get(`${baseURL}/api/batches`);
        setBatchOptions(normalizeListResponse(batchRes));
      } catch (error) {
        console.error('Failed to fetch batches', error);
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
        const batch = res?.data?.batch || {};
        const batchId = batch?.id;
        const batchName = batch?.batch_name ?? batch?.name ?? '';
        const classes = res?.data?.class || [];
        const divisions = res?.data?.division || [];
        const batchmasters = res?.data?.batchmasters || res?.data?.batchMasters || [];

        classes.forEach((item) => {
          const classId = getRawId(item);
          const optionId = `${batchId}-${classId}`;
          classMap.set(optionId, {
            ...item,
            batchId,
            batch_name: batchName,
            optionId,
          });
        });

        const addDivisionOption = (cls, div) => {
          const classId = getRawId(cls);
          const divisionId = getRawId(div);
          const optionId = `${batchId}-${classId}-${divisionId}`;
          divisionMap.set(optionId, {
            ...div,
            classId,
            class_name: cls?.class_name ?? cls?.name ?? '',
            batchId,
            optionId,
          });
        };

        if (batchmasters.length) {
          batchmasters.forEach((bm) => {
            const cls = classes.find((c) => String(c.id) === String(bm.classId));
            const div = divisions.find(
              (d) => String(d.id) === String(bm.divisionId ?? bm.divId)
            );
            if (cls && div) addDivisionOption(cls, div);
          });
        } else {
          classes.forEach((cls) => {
            divisions.forEach((div) => addDivisionOption(cls, div));
          });
        }
      });
      setClassOptions(Array.from(classMap.values()));
      setDivisionOptions(Array.from(divisionMap.values()));
    } catch (error) {
      console.error('Failed to fetch batch relations', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setMessage(`Saving ${nameLabel.toLowerCase()}...`);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSubmitting(true);

      const titleValue = values[fieldName]?.trim() || '';

      const rows = buildSubmitTargets(
        values.divisions,
        divisionOptions,
        fieldName,
        titleValue,
        values.date
      );

      if (!rows.length) {
        setErrorMsg('Select at least one batch, class and division combination.');
        setLoading(false);
        setSubmitting(false);
        return;
      }

      const res = await axios.post(`${baseURL}${saveUrl}`, { rows });

      setSuccessMsg(
        getApiMessage(res?.data) || `${nameLabel} saved successfully`
      );
      resetForm();
      setClassOptions([]);
      setDivisionOptions([]);
    } catch (error) {
      console.error('Save failed:', error);
      setErrorMsg(
        getApiMessage(error.response?.data) ||
          error.message ||
          `Failed to save ${nameLabel.toLowerCase()}. Please try again.`
      );
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
              <Icon icon={icon} width="24" />
            </span>
            <div>
              <h5 className="card-title">{title}</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMsg}
              <button type="button" className="btn-close" onClick={() => setSuccessMsg('')} />
            </div>
          )}
          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button type="button" className="btn-close" onClick={() => setErrorMsg('')} />
            </div>
          )}
          <div className="form-area">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, resetForm, setFieldValue, values }) => (
                <Form className="chfi-root">
                  {loading && <Loader message={message} />}

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      {nameLabel}
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:text-field-bold-duotone" width="18" />
                      </span>
                      <Field
                        type="text"
                        name={fieldName}
                        className="form-control"
                        placeholder={`Type ${nameLabel.toLowerCase()} name...`}
                        autoComplete="off"
                      />
                    </div>
                    <ErrorMessage
                      name={fieldName}
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Date
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:calendar-bold-duotone" width="18" />
                      </span>
                      <Field type="date" name="date" className="form-control" />
                    </div>
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Batch
                    </label>
                    <MultiChipSelect
                      fieldName="batches"
                      options={batchOptions}
                      optionLabel={(b) => b?.batch_name ?? b?.name ?? b?.title}
                      values={values}
                      setFieldValue={setFieldValue}
                      placeholder="+ Select Batch"
                      onSelectionChange={(batchIds) =>
                        fetchBatchRelations(batchIds, setFieldValue)
                      }
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
                      optionLabel={(c) => {
                        const batchName = c?.batch_name ?? '';
                        const className = c?.class_name ?? c?.name ?? '';
                        return batchName ? `${batchName} - ${className}` : className;
                      }}
                      values={values}
                      setFieldValue={setFieldValue}
                      placeholder="+ Select Class"
                      disabled={!values.batches?.length}
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Division
                    </label>
                    <MultiChipSelect
                      fieldName="divisions"
                      options={divisionOptions}
                      optionLabel={(d) => {
                        const className = d?.class_name ?? '';
                        const divisionName = d?.division_name ?? d?.name ?? '';
                        return className ? `${className} - ${divisionName}` : divisionName;
                      }}
                      values={values}
                      setFieldValue={setFieldValue}
                      placeholder="+ Select Division"
                      disabled={!values.batches?.length}
                    />
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-reset"
                      onClick={() => {
                        resetForm();
                        setClassOptions([]);
                        setDivisionOptions([]);
                      }}
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
                          Save {nameLabel}
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

export default HolidayEventCommon;

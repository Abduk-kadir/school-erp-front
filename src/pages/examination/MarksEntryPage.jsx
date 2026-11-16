import React,{useState,useEffect,useRef}from 'react'
import { Modal } from 'react-bootstrap';
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../utils/baseUrl";
import axios from 'axios';
import "../../assets/css/mastercom.css";
import "../../assets/css/examination.css";
import ExamDataTable from '../../components/ExamDataTable';
import { useNavigate } from 'react-router-dom';
import { setResultMarkEntry } from '../../redux/slices/resultMarkEntry';
import { useDispatch } from 'react-redux';
import downloadAddMarkExcel from '../../utils/downloadAddMarkExcel';
import downloadCoScholasticExcel from '../../utils/downloadCoScholasticExcel';

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const columns=[
  {data:"scheme.examNameInfo.exam_name",name:"scheme.examNameInfo.exam_name",title:"Exam"},
  {data:"scheme.classInfo.class_name",name:"scheme.classInfo.class_name",title:"Class"},
  {data:"scheme.termInfo.term_name",name:"scheme.termInfo.term_name",title:"Term"},
  {data:"divisionInfo.division_name",name:"divisionInfo.division_name",title:"Division"},
  {data:"subjectInfo.value",name:"subjectInfo.value",title:"Subject"},
  {data:"searchbystudent",name:"searchbystudent",title:"Sort By Student"},
  {
    data: null,
    title: "Actions",
    orderable: false,
    searchable: false,
    render: (data, type, row) => `
      <div class="table-action-group table-action-stack">
        <button type="button" class="table-action-btn table-action-add-marks" data-id="${row.id}" title="Add Marks">Add Marks</button>
        <button type="button" class="table-action-btn table-action-excel" data-id="${row.id}" title="Upload & Download Excel">Upload & Download Excel</button>
        <button type="button" class="table-action-btn table-action-lock" data-id="${row.id}" title="Lock Marks Entry">Lock Marks Entry</button>
      </div>
    `,
  },
  
]

const MarksEntryPage = () => {

  const [exam,setExam]=useState([]);
  const [selectedExam,setSelectedExam]=useState('');
  const [selectedClass,setSelectedClass]=useState('');
  const [selectedTerm,setSelectedTerm]=useState('');
  const [selectedDivision,setSelectedDivision]=useState('');
  const [selectedSubject,setSelecedSubject]=useState('');
  const [examschemid,setExamSchemid]=useState(null);
  const [programsubjects,setProgramSubjects]=useState(null);
  const [filterby,setFilterBy]=useState('')
  const [examSchemes,setExamSchemes]=useState([]);
  const [classdivisionmap,setClassDivisionMap]=useState([]);
  const [classlist,setClassList]=useState([])
  const [termList,setTermList]=useState([])
  const [divisionList,setDivisionList]=useState([])
  const [filterbylist,setFilterByList]=useState([
    'roll_no','reg_no','seat_no'
  ])

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch=useDispatch();
  const [students,setStudents]=useState([]);
  const [excelEntry, setExcelEntry] = useState(null);
  const [excelBusy, setExcelBusy] = useState("");
  const [excelMsg, setExcelMsg] = useState({ type: "", text: "", errors: [] });
  const importInputRef = useRef(null);

  const navigate=useNavigate();
  console.log('examschemid:',examschemid)
  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    
    if (!examId) return;
  
    try {
      const { data } = await axios.get(`${baseURL}/api/exam-schemes/exam-name/${examId}`);
      setExamSchemes(data?.data || []);
      let filterClass=data?.data?.map(item=>({id:item.classInfo?.id,class_name:item.classInfo?.class_name}))
      console.log('filter class',filterClass)
      let uniqueClass=[...new Map(filterClass.map(item=>[item.id,item])).values()]
      console.log('unique class',uniqueClass)
      setClassList(uniqueClass)
    } catch (err) {
      console.error("Failed to load exam schemes", err);
      setErrorMsg(err.response?.data?.message || "Failed to load exam schemes");
    }
  };
  const handleChangeClass=async(e)=>{
    const classId=e.target.value;
    console.log(classId);
    setSelectedClass(classId);
    if(!classId) return;

    let filterTerms=examSchemes.filter(item=>item.classInfo?.id==classId);
    console.log('filter terms',filterTerms)

    let division=classdivisionmap.filter(item=>item.classInfo?.id==classId);
    setDivisionList(division.map(item=>({id:item.divisionInfo?.id,division_name:item.divisionInfo?.division_name})))
    setTermList(filterTerms.map(item=>({id:item.termInfo?.id,term_name:item.termInfo?.term_name})))
    try{
    
    
     let {data}=await axios.get(`${baseURL}/api/program-subjects?classId=${classId}`);
     setProgramSubjects(data?.data);
     console.log('program subjects:',programsubjects)
    }
    catch(error){

    }
    
  }
  const handleChangeTerm=async(e)=>{
    console.log('handle term is calling')
    const termId=e.target.value;
    console.log('termId:',termId);
    setExamSchemid(examSchemes.find(item=>item.exam_name_id==selectedExam&&item.classInfo?.id==selectedClass&&item.termInfo?.id==termId)?.id)
    setSelectedTerm(termId);
  

  }


  useEffect(()=>{
    let fetchData=async()=>{
      Promise.allSettled([
        axios.get(`${baseURL}/api/exam-names`),
        axios.get(`${baseURL}/api/class-div-map-masters`),
      ]).then(([examResponse,classDivisionResponse])=>{
        setExam(examResponse.value.data.data);
        setClassDivisionMap(classDivisionResponse.value.data.data);
      }).catch((error)=>{
        console.log(error);
      });
    }
    fetchData();

  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const missing = [
      [selectedExam, "Exam"],
      [selectedClass, "Class"],
      [selectedTerm, "Term"],
      [selectedDivision, "Division"],
      [selectedSubject, "Subject"],
    ].filter(([value]) => !value).map(([, label]) => label);

    if (missing.length) {
      setErrorMsg(`Please select ${missing.join(", ")}`);
      return;
    }

    const payload = {
      exam_scheme_id: examschemid,
      class_id: selectedClass,
      term_id: selectedTerm,
      division_id: selectedDivision,
      subject_id: selectedSubject,
      sort_by: filterby || undefined,
    };

    setSubmitting(true);
    try {
      const { data: configureRes } = await axios.get(`${baseURL}/api/exam-configures/search`, {
        params: {
          exam_scheme_id: examschemid,
          class_id: selectedClass,
          term_id: selectedTerm,
          subject_id: selectedSubject,
        },
        headers: authHeaders(),
      });
      const configure = configureRes?.data;
      if (!configureRes?.success || !configure) {
        setErrorMsg(configureRes?.message || "Exam configure not found for this exam scheme, class, term and subject");
        return;
      }

      const isDescriptor = String(configure?.gradeScale?.type || "").toLowerCase() === "descriptor";
      const endpoint = isDescriptor ? "/api/student-co-scholastic-marks" : "/api/result-mark-entry-lists";

      const { data } = await axios.post(`${baseURL}${endpoint}`, payload, {
        headers: authHeaders(),
      });
      setSuccessMsg(data?.message || "Submitted successfully");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedExam('');
    setSelectedClass('');
    setSelectedTerm('');
    setSelectedDivision('');
    setSelecedSubject('');
    setFilterBy('');
    setExamSchemid(null);
    setClassList([]);
    setTermList([]);
    setDivisionList([]);
    setProgramSubjects(null);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleAddMarks = async (id, row) => {
    console.log('id:',id)
    console.log('row:',row)
    dispatch(setResultMarkEntry({marksentryvalue:row}));
    navigate(`/dashboard/examination/add-marks-to-student/${id}`)
    
    
  };

  const handleDownloadExcel = (id, row) => {
    setExcelMsg({ type: "", text: "", errors: [] });
    setExcelEntry({ id, row });
  };

  const closeExcelModal = () => {
    if (excelBusy) return;
    setExcelEntry(null);
    setExcelMsg({ type: "", text: "", errors: [] });
  };

  const handleDownloadMarksExcel = async () => {
    if (!excelEntry) return;
    setExcelMsg({ type: "", text: "", errors: [] });
    setExcelBusy("download");
    try {
      const entryRow = excelEntry.row;
      const { data: configureRes } = await axios.get(`${baseURL}/api/exam-configures/search`, {
        params: {
          exam_scheme_id: entryRow?.exam_scheme_id,
          class_id: entryRow?.scheme?.class_id ?? entryRow?.scheme?.classInfo?.id,
          term_id: entryRow?.scheme?.term_id ?? entryRow?.scheme?.termInfo?.id,
          subject_id: entryRow?.subject_id,
        },
        headers: authHeaders(),
      });
      const configure = configureRes?.data;
      if (!configureRes?.success || !configure) {
        setExcelMsg({
          type: "danger",
          text: configureRes?.message || "Exam configure not found for this exam scheme, class, term and subject",
          errors: [],
        });
        return;
      }
      const isDescriptor = String(configure?.gradeScale?.type || "").toLowerCase() === "descriptor";

      const studentsUrl = isDescriptor
        ? `${baseURL}/api/result-mark-entry-lists/${excelEntry.id}/co-scholastic-students`
        : `${baseURL}/api/result-mark-entry-lists/${excelEntry.id}/students`;
      const { data } = await axios.get(studentsUrl, { headers: authHeaders() });
      const studentsForExcel = data?.data || [];
      setStudents(studentsForExcel);

      if (isDescriptor) {
        await downloadCoScholasticExcel(entryRow, studentsForExcel, configure);
        setExcelMsg({ type: "success", text: "Co-scholastic excel downloaded.", errors: [] });
      } else {
        await downloadAddMarkExcel(entryRow, studentsForExcel);
        setExcelMsg({ type: "success", text: "Marks entry excel downloaded.", errors: [] });
      }
    } catch (err) {
      console.error("Failed to download marks excel", err);
      setExcelMsg({
        type: "danger",
        text: err.response?.data?.message || err.message || "Failed to download excel",
        errors: [],
      });
    } finally {
      setExcelBusy("");
    }
  };

  const handleImportMarksExcel = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !excelEntry) return;

    if (!/\.xlsx$/i.test(file.name)) {
      setExcelMsg({ type: "danger", text: "Please choose an .xlsx file.", errors: [] });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setExcelMsg({ type: "", text: "", errors: [] });
    setExcelBusy("import");
    try {
      const entryRow = excelEntry.row;
      const { data: configureRes } = await axios.get(`${baseURL}/api/exam-configures/search`, {
        params: {
          exam_scheme_id: entryRow?.exam_scheme_id,
          class_id: entryRow?.scheme?.class_id ?? entryRow?.scheme?.classInfo?.id,
          term_id: entryRow?.scheme?.term_id ?? entryRow?.scheme?.termInfo?.id,
          subject_id: entryRow?.subject_id,
        },
        headers: authHeaders(),
      });
      const configure = configureRes?.data;
      if (!configureRes?.success || !configure) {
        setExcelMsg({
          type: "danger",
          text: configureRes?.message || "Exam configure not found for this exam scheme, class, term and subject",
          errors: [],
        });
        return;
      }

      const isDescriptor = String(configure?.gradeScale?.type || "").toLowerCase() === "descriptor";
      const importUrl = isDescriptor
        ? `${baseURL}/api/student-co-scholastic-marks/import-co-scholastic-marks`
        : `${baseURL}/api/result-mark-entry-lists/import-marks`;

      const { data } = await axios.post(importUrl, formData, {
        headers: authHeaders(),
      });
      setExcelMsg({
        type: "success",
        text: data?.message || (isDescriptor ? "Co-scholastic marks imported successfully." : "Marks imported successfully."),
        errors: [],
      });
    } catch (err) {
      console.error("Failed to import marks excel", err);
      setExcelMsg({
        type: "danger",
        text: err.response?.data?.message || err.message || "Failed to import excel",
        errors: Array.isArray(err.response?.data?.errors) ? err.response.data.errors : [],
      });
    } finally {
      setExcelBusy("");
    }
  };

  const fields = [
    {
      id: "marks-exam",
      label: "Exam",
      required: true,
      icon: "solar:document-text-bold-duotone",
      value: selectedExam,
      onChange: handleExamChange,
      placeholder: "Select Exam",
      options: exam.map((item) => ({ value: item.id, label: item.exam_name })),
    },
    {
      id: "marks-class",
      label: "Class",
      required: true,
      icon: "solar:square-academic-cap-bold-duotone",
      value: selectedClass,
      onChange: handleChangeClass,
      placeholder: "Select Class",
      options: classlist.map((item) => ({ value: item.id, label: item.class_name })),
    },
    {
      id: "marks-term",
      label: "Term",
      required: true,
      icon: "solar:calendar-bold-duotone",
      value: selectedTerm,
      onChange: handleChangeTerm,
      placeholder: "Select Term",
      options: termList.map((item) => ({ value: item.id, label: item.term_name })),
    },
    {
      id: "marks-division",
      label: "Division",
      required: true,
      icon: "solar:users-group-rounded-bold-duotone",
      value: selectedDivision,
      onChange: (e) => setSelectedDivision(e.target.value),
      placeholder: "Select Division",
      options: divisionList.map((item) => ({ value: item.id, label: item.division_name })),
    },
    {
      id: "marks-subject",
      label: "Subject",
      required: true,
      icon: "solar:book-bookmark-bold-duotone",
      value: selectedSubject,
      onChange: (e) => setSelecedSubject(e.target.value),
      placeholder: "Select Subject",
      options: (programsubjects || []).map((item) => ({ value: item?.subject?.id, label: item?.subject?.value })),
    },
    {
      id: "marks-sort",
      label: "Sort Students By",
      required: false,
      icon: "solar:sort-vertical-bold-duotone",
      value: filterby,
      onChange: (e) => setFilterBy(e.target.value),
      placeholder: "Select Filter By",
      options: filterbylist.map((item) => ({ value: item, label: item })),
    },
  ];
  

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:clipboard-list-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Marks Entry</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMsg}
              <button type="button" className="btn-close" onClick={() => setSuccessMsg("")} />
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button type="button" className="btn-close" onClick={() => setErrorMsg("")} />
            </div>
          )}

          <div className="form-area">
            <form className="chfi-root dynamic-form" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div key={field.id} className="field-row">
                  <label htmlFor={field.id} className="form-label">
                    <span className="label-dot" />
                    {field.label}
                    {field.required && <span className="text-danger"> *</span>}
                  </label>
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon={field.icon} width="18" />
                    </span>
                    <select id={field.id} className="form-select" value={field.value} onChange={field.onChange}>
                      <option value="">{field.placeholder}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <div className="actions">
                <button type="button" className="btn btn-reset" onClick={handleReset} disabled={submitting}>
                  <Icon icon="solar:restart-bold-duotone" width="16" />
                  Reset
                </button>
                <button type="submit" className="btn btn-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Icon icon="line-md:loading-loop" width="16" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:check-circle-bold-duotone" width="18" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <ExamDataTable
          embedded
          columns={columns}
          pageName={"Marks Entry"}
          url={`${baseURL}/api/result-mark-entry-lists`}
          onAddMarks={handleAddMarks}
          onDownloadExcel={handleDownloadExcel}
          />
        </div>
      </div>

      <Modal
        show={!!excelEntry}
        onHide={closeExcelModal}
        centered
        dialogClassName="mx-dialog"
        contentClassName="mx-content"
        backdrop={excelBusy ? "static" : true}
      >
        <div className="mx-header">
          <span className="mx-header-icon">
            <Icon icon="solar:file-text-bold-duotone" width="26" />
          </span>
          <div className="mx-header-text">
            <h5 className="mx-title">Marks Entry Excel</h5>
            <p className="mx-subtitle">Download the sheet, fill marks and import it back</p>
          </div>
          <button
            type="button"
            className="mx-close"
            onClick={closeExcelModal}
            disabled={!!excelBusy}
            aria-label="Close"
          >
            <Icon icon="solar:close-circle-bold-duotone" width="24" />
          </button>
        </div>

        <div className="mx-body">
          {excelEntry?.row && (
            <div className="mx-chips">
              {[
                ["solar:document-text-bold-duotone", excelEntry.row?.scheme?.examNameInfo?.exam_name],
                ["solar:square-academic-cap-bold-duotone", excelEntry.row?.scheme?.classInfo?.class_name],
                ["solar:calendar-bold-duotone", excelEntry.row?.scheme?.termInfo?.term_name],
                ["solar:users-group-rounded-bold-duotone", excelEntry.row?.divisionInfo?.division_name],
                ["solar:book-bookmark-bold-duotone", excelEntry.row?.subjectInfo?.value],
              ]
                .filter(([, value]) => value)
                .map(([icon, value]) => (
                  <span key={icon} className="mx-chip">
                    <Icon icon={icon} width="14" />
                    {value}
                  </span>
                ))}
            </div>
          )}

          {excelMsg.text && (
            <div className={`mx-alert mx-alert-${excelMsg.type}`} role="alert">
              <Icon
                icon={excelMsg.type === "success" ? "solar:check-circle-bold-duotone" : "solar:danger-triangle-bold-duotone"}
                width="20"
                className="mx-alert-icon"
              />
              <div className="mx-alert-text">
                <div>{excelMsg.text}</div>
                {excelMsg.errors.length > 0 && (
                  <ul className="mx-alert-list">
                    {excelMsg.errors.map((item, index) => (
                      <li key={index}>
                        {item.row ? `Row ${item.row}` : ""}
                        {item.column ? `, Column ${item.column}` : ""}
                        {item.row || item.column ? ": " : ""}
                        {item.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="mx-actions">
            <button
              type="button"
              className="mx-action mx-action-download"
              onClick={handleDownloadMarksExcel}
              disabled={!!excelBusy}
            >
              <span className="mx-action-icon">
                <Icon
                  icon={excelBusy === "download" ? "line-md:loading-loop" : "solar:download-minimalistic-bold-duotone"}
                  width="24"
                />
              </span>
              <span className="mx-action-text">
                <span className="mx-action-title">
                  {excelBusy === "download" ? "Downloading..." : "Download Marks Entry Excel"}
                </span>
                <span className="mx-action-desc">Sheet with students, heads and formulas</span>
              </span>
              <Icon icon="solar:alt-arrow-right-linear" width="18" className="mx-action-arrow" />
            </button>

            <button
              type="button"
              className="mx-action mx-action-import"
              onClick={() => importInputRef.current?.click()}
              disabled={!!excelBusy}
            >
              <span className="mx-action-icon">
                <Icon
                  icon={excelBusy === "import" ? "line-md:loading-loop" : "solar:upload-minimalistic-bold-duotone"}
                  width="24"
                />
              </span>
              <span className="mx-action-text">
                <span className="mx-action-title">
                  {excelBusy === "import" ? "Importing..." : "Import Marks Entry Excel"}
                </span>
                <span className="mx-action-desc">Upload the filled .xlsx to save marks</span>
              </span>
              <Icon icon="solar:alt-arrow-right-linear" width="18" className="mx-action-arrow" />
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept=".xlsx"
              className="d-none"
              onChange={handleImportMarksExcel}
            />

            <button type="button" className="mx-action mx-action-pdf" disabled>
              <span className="mx-action-icon">
                <Icon icon="solar:document-bold-duotone" width="24" />
              </span>
              <span className="mx-action-text">
                <span className="mx-action-title">Download Mark Writing PDF</span>
                <span className="mx-action-desc">Printable sheet for writing marks</span>
              </span>
              <span className="mx-soon">Soon</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MarksEntryPage


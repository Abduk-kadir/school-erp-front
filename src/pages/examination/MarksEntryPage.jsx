import React,{useState,useEffect}from 'react'
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../utils/baseUrl";
import axios from 'axios';
import "../../assets/css/mastercom.css";
import "../../assets/css/examination.css";
import ExamDataTable from '../../components/ExamDataTable';
import { useNavigate } from 'react-router-dom';
import { setResultMarkEntry } from '../../redux/slices/resultMarkEntry';
import { useDispatch } from 'react-redux';

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
      exam_name_id: selectedExam,
      class_id: selectedClass,
      term_id: selectedTerm,
      division_id: selectedDivision,
      subject_id: selectedSubject,
      sort_by: filterby || undefined,
    };

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${baseURL}/api/result-mark-entry-lists`, payload, {
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

  const handleUploaddownloadExcel = (id,row) => {
    console.log("Edit term:", id);
    console.log('row:',row)
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
          />
        </div>
      </div>
    </div>
  )
}

export default MarksEntryPage


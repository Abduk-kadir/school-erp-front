import React, { useState, useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import Loader from '../../../helper/Loader';


const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

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
        // optionId: String(classId),
      });
    }

    divisionOptions.push({
      classId,
      divisionId,
      class_name: className,
      division_name: divisionName,
      // optionId: `${classId}-${divisionId}`,
    });
  });

  return {
    classOptions: Array.from(classMap.values()),
    divisionOptions,
  };
};


const initialValues = {
  batch_name: '',
  classid: '',
  divisionid: ''
};

const validationSchema = Yup.object({
  batch_name: Yup.string()
    .required('Batch name is required'),

  classid: Yup.string().required('class  is required'),
  divsionid: Yup.string().required('division is required'),



});

function AssignSubjectStudent() {
  const [classOptions, setClassOptions] = useState([]);
  const [allDivisionOptions, setAllDivisionOptions] = useState([]);
  const [allSubject, setAllSubject] = useState([])
  const [complusarySub, setComplusary] = useState([])
  const [optionalSub, setOptional] = useState([])
  const [batches, setBatches] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([])
  const [selectedStudents,setSelectedStudents]=useState([])
  const [selectedOptionalSubject, setSelectedOptionalSubject] = useState([])
  const [programid, setProgramid] = useState(null)
  const [classid, setClassid] = useState(null)
  const [semester, setSemester] = useState(null)
  const [electiveBasketId, setElectiveBasketId] = useState(null)
  const [exactChoices, setExactChoice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEdit, setEdit] = useState(false)



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
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClassId) {
        setBatches([]);
        setAllSubject([]);
        return;
      }
      try {
        console.log('fetching subjects for classId:', selectedClassId);
        const { data } = await axios.get(
          `${baseURL}/api/program-subjects/byclasssemester?classId=${selectedClassId}`
        );
        const list = data?.data || [];
        setBatches(list.map((elem) => elem.batch) || []);
        setAllSubject(list);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      }
    };
    fetchSubjects();
  }, [selectedClassId])

  const handleSubmit = async (values) => {
    console.log('handle search', values)
    try {
      let { data } = await axios.get(
        `${baseURL}/api/parmanent-personal-information`,
        {
          params: {
            class: values.classid,
            division: values.divisionid,
          },
        }
      );

      let allRegNo = data.data.map(elem => elem.reg_no)
      console.log('all reg_nos:', { allRegNo: allRegNo })
      let res = await axios.post(`${baseURL}/api/studentsubjects/regids`, { allRegNo: allRegNo })

      let leng = res?.data?.data.length >= 1
      if (leng) {
        setEdit(true)
      }
      setStudents(data?.data || [])
      setSelectedOptionalSubject(res?.data?.data || [])

    }
    catch (err) {
      alert(err?.message ? err.data?.messaage : "error in fetching student")

    }


  }

  const handleOptionalSubjectChange = (reg_no, subjectid, isChecked) => {
    console.log(subjectid)
    setSelectedOptionalSubject((prev) => {
      if (isChecked) {
        // Add if not already present
        const exists = prev.some(
          (item) => item.reg_no === reg_no && item.subjectid === subjectid
        );
        if (exists) return prev;
        return [...prev, { student_reg_no: reg_no, class_id: classid, program_id: programid, semester, subject_id: subjectid, elective_bbasket_id: electiveBasketId }];
      } else {
        // Remove
        return prev.filter(
          (item) => !(item.student_reg_no === reg_no && item.subject_id === subjectid)
        );
      }
    });
  };
  const handleHeaderSubjectChange = (subjectId, isChecked) => {
    setSelectedOptionalSubject((prev) => {
      if (isChecked) {
        // Keep existing selections that are NOT this subject
        const others = prev.filter((item) => item.subject_id !== subjectId);

        // Add this subject for every student (if not already present)
        const newEntries = students.map((stu) => {
          const regNo = stu.reg_no || stu.id;
          return {
            student_reg_no: regNo,
            class_id: classid,
            program_id: programid,
            semester,
            subject_id: subjectId,
            elective_bbasket_id: electiveBasketId
          };
        });

        // Avoid duplicates just in case
        const uniqueNew = newEntries.filter(
          (entry) => !others.some(
            (o) => o.student_reg_no === entry.student_reg_no && o.subject_id === entry.subject_id
          )
        );

        return [...others, ...uniqueNew];
      } else {
        // Remove this subject for all students
        return prev.filter((item) => item.subject_id !== subjectId);
      }
    });
  };
  const isSubjectFullySelected = (subjectId) => {
    if (students.length === 0) return false;
    return students.every((stu) => {
      const regNo = stu.reg_no || stu.id;
      return selectedOptionalSubject.some(
        (item) => item.student_reg_no === regNo && item.subject_id === subjectId
      );
    });
  };
  const handleSave = async () => {
    try {
      setLoading(true)
      if (!isEdit) {

      }
      else {
        let studentSet=new Set(selectedStudents)
        const filterselectedOptionalSubject = selectedOptionalSubject.filter(
          elem => studentSet.has(elem.student_reg_no)
        );   
       // let { data } = await axios.post(`${baseURL}/api/studentsubjects/bulk`, { assignments: filterselectedOptionalSubject })
        console.log('filter data is:',filterselectedOptionalSubject)
        alert('sujects are added successfully')
      }
    }
    catch (err) {
      alert(err.response?.data?.message || err.message || 'Error');
      console.log('error when saving student subject')
    }
    finally {
      setSelectedOptionalSubject([])
      setLoading(false)
    }
  }
  //left most checkbox selection start here
  const  handleStudentCheckboxChange=(reg_no,isChecked)=>{
    if(isChecked){
       setSelectedStudents((prev)=>{
        return [...prev,reg_no]
       })
      
    }
    else{
      setSelectedStudents((prev) => {
        return prev.filter((item) => item !== reg_no);
      });

    }

  }

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:diploma-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Assign Subject To Student</h5>
            </div>
          </div>
        </div>
        <div className='card-body'>
          {loading && <Loader message={'saving subject'} />}
          <Formik
            initialValues={initialValues}
            //validationSchema={validationSchema}
            onSubmit={handleSubmit}

          >
            {({ isSubmitting, resetForm, setFieldValue, values }) => {


              return (
                <Form>

                  <div className='row mb-20'>
                    <div className='col-4'>
                      <label htmlFor="class">Class</label>
                      <Field as="select"
                        name="classid"
                        onChange={(e) => {
                          const id = e.target.value;
                          setFieldValue('classid', id);
                          setFieldValue('divisionid', ''); // reset division
                          setSelectedClassId(id);         // ← trigger the effect
                        }}

                        className='form-select' >
                        <option value="">-- Select Class --</option>
                        {
                          classOptions.map(elem => {
                            return (
                              <option value={elem?.id}>{elem?.class_name}</option>
                            )
                          })
                        }


                      </Field>
                      <ErrorMessage name="class" component="div" />
                    </div>

                    <div className='col-4'>
                      <label className='form-lebel'>Select Division</label>
                      <Field as="select" name="divisionid" className='form-select' >
                        <option value="">-- Select Division --</option>
                        {
                          allDivisionOptions.filter(elem => elem.classId == values.classid).map(elem => {

                            return (
                              <option value={elem?.divisionId}>{elem?.division_name}</option>
                            )

                          })
                        }


                      </Field>
                      <ErrorMessage name="class" component="div" />
                    </div>

                    <div className='col-4'>
                      <label className='form-lebel'>Select Batch</label>
                      <Field as="select"
                        name="batch_name"
                        className='form-select'
                        onChange={(e) => {
                          const batchname = e.target.value;

                          let filtersubject = allSubject.find(elem => elem.batch == batchname)
                          let cumplusary = filtersubject?.compulsorySubjects || []
                          const sem = filtersubject?.semesterId ?? null;
                          const prog = filtersubject?.programId ?? null;
                          const cl = filtersubject?.classId ?? null;
                          const optionalGroup = filtersubject?.optionalSubjects?.[0] ?? null;

                          const optional = optionalGroup?.subjects ?? [];
                          const elective = optionalGroup?.electiveBasketId ?? null;
                          const exactCh = optionalGroup?.exactChoices ?? null;

                          setFieldValue('batch_name', batchname);
                          setComplusary(cumplusary)
                          setOptional(optional)
                          setExactChoice(exactCh)
                          setElectiveBasketId(elective)
                          setSemester(sem)
                          setProgramid(prog)
                          setClassid(cl)


                        }}



                      >
                        <option value="">-- Select Batch --</option>
                        {
                          batches.map(elem => {

                            return (
                              <option value={elem}>{elem}</option>
                            )

                          })
                        }


                      </Field>
                      <ErrorMessage name="class" component="div" />
                    </div>
                    <div className='d-flex justify-content-end mt-3'>
                      <button className='btn btn-success' type='submit'> Search</button>

                    </div>
                  </div>

                </Form>
              );
            }}
          </Formik>
          <h6>Complusary Subjects:
            <span className='text-secondary'>{complusarySub.map(elem => elem?.subjectName).join(',')}</span>

          </h6>
          <table class="table border">
            <thead>
              <tr>
                <th>
                  
                </th>
                <th>Reg No</th>
                <th>Student Name</th>
                <th>Roll NO </th>
                <th>
                  {optionalSub.map((subject) => {
                    const subjectId = subject.subjectId || subject.id;
                    const fullySelected = isSubjectFullySelected(subjectId);


                    return (
                      <div className="form-check form-check-inline" key={`header-${subjectId}`}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`header-opt-${subjectId}`}
                          checked={fullySelected}

                          onChange={(e) =>
                            handleHeaderSubjectChange(subjectId, e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label fw-bold"
                          htmlFor={`header-opt-${subjectId}`}
                        >
                          {subject?.subjectName}
                        </label>
                      </div>
                    );
                  })}
                </th>

              </tr>
            </thead>

            <tbody>
              {
                students.map(elem => (
                  <tr>
                    <td>

                    <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedStudents.includes(elem?.reg_no)}
                    onChange={(e) =>
                      handleStudentCheckboxChange(
                        elem.reg_no,
                        e.target.checked
                      )
                    }
                  />



                    </td>
                    <td>{elem.reg_no}</td>
                    <td>{elem.first_name + " " + elem.last_name}</td>
                    <td>{elem?.roll_number}</td>
                    <td>


                      {optionalSub.map((subject) => {
                        const subjectId = subject.subjectId || subject.id; // adjust according to your API
                        const regNo = elem.reg_no || elem.id;               // prefer reg_no if available

                        const isChecked = selectedOptionalSubject.some(
                          (item) => item.student_reg_no === regNo && item.subject_id === subjectId
                        );

                        return (
                          <div className="form-check form-check-inline" key={subjectId}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`opt-${regNo}-${subjectId}`}
                              checked={isChecked}
                              onChange={(e) =>
                                handleOptionalSubjectChange(regNo, subjectId, e.target.checked)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`opt-${regNo}-${subjectId}`}
                            >
                              {subject?.subjectName}
                            </label>
                          </div>
                        );
                      })}

                    </td>

                  </tr>
                ))
              }

            </tbody>
          </table>
          <div className='d-flex justify-content-end mt-3'>
            <button className='btn btn-success' onClick={handleSave}>Save</button>

          </div>
        </div>


      </div>
    </div>
  )
}

export default AssignSubjectStudent
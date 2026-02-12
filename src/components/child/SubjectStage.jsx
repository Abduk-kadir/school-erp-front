import axios from "axios"
import { useState, useEffect } from "react"
import baseURL from "../../utils/baseUrl"
import { Button } from "react-bootstrap"
import FormWizard from "./FormWizard"
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
const SubjectStage = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([])
    const [programs, setPrograms] = useState([])
    const [checkedSubjects, setCheckedSubjects] = useState([]);
    const [selectedProgram, setSeletedProgram] = useState('')
    const [searchParams] = useSearchParams();
    const [studentSubject, setStudentSubject] = useState([])
    const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
    let step = searchParams.get("step")
    step = Number(step)

    useEffect(() => {
        console.log('fetching is called')
        let fetchData = async () => {
            try {
                const { data } = await axios.get(`${baseURL}/api/studentsubjects/student/${reg_no}`);
                let editedCheckedSubjects = data?.data?.filter(elem => elem.elective_bbasket_id)
                 console.log('edtited checked subject**:', editedCheckedSubjects)
                const normalizedData = editedCheckedSubjects.map(item => ({
                    subject:item.subject.value,   // if you have subject value from your subjects list
                    subjectId: item.subject_id,
                    electiveId: item.elective_bbasket_id,
                    classId: item.class_id,
                    programId: item.program_id,
                    semester: item.semester
                }));
                setCheckedSubjects(normalizedData)
            }
            catch (err) {

            }
        }
        fetchData()
    }, [])


    useEffect(() => {
        let fetchData = async () => {
            try {
                const subjectAPI = axios.get(`${baseURL}/api/program-subjects?classId=5`);
                const programsAPI = axios.get(`${baseURL}/api/programs`);
                const [subjectRes, programsRes] = await Promise.all([subjectAPI, programsAPI]);
                // Set state
                setSubjects(subjectRes.data.data); // assuming your API returns { success, count, data }
                setPrograms(programsRes.data.data); // adjust according to your API response
            }
            catch (err) {

                console.log(err)
            }

        }
        fetchData()
    }, [])
    const filterSubject = selectedProgram ? subjects.filter(elem => elem?.programId == selectedProgram) : subjects
    const nonCompulsory = filterSubject.filter(item => !item.isCompulsory);

    const grouped = nonCompulsory.reduce((acc, item) => {
        const basketId = item.basketId;

        if (!acc[basketId]) acc[basketId] = [];

        acc[basketId].push({

            exactChoices: item.electivebasket?.exactChoices, // from basket table
            subject: item.subject.value,
            electiveId: item.electivebasket?.id,
            semester: item.semester,
            subjectId: item.subjectId,
            classId: item.classId,
            programId: item.programId
        });

        return acc;
    }, {});

    const allOption = Object.values(grouped).map(arr => ({
        opion: arr
    }));


    // console.log('filter subject**:', filterSubject)
    // console.log('noncomplusary subjects are**:', nonCompulsory)
    //console.log('grouped**', grouped)
    // console.log('alloption***:', allOption)
    console.log('checked subjects**:', checkedSubjects)


    const handleCheckboxChange = (item, groupIndex) => {
        setCheckedSubjects(prev => {
            const exists = prev.find(s => s.subject === item.subject && s.electiveId === item.electiveId);

            if (exists) {
                // remove if unchecked
                return prev.filter(s => !(s.subject === item.subject && s.electiveId === item.electiveId));
            } else {
                // add if checked
                return [...prev, item];
            }
        });
    };


    const handleSubmit = async () => {
        console.log('selected program', selectedProgram)
        let complusaryData = filterSubject.reduce((arr, elem) => {
            if (elem.isCompulsory == true) {
                arr.push({ student_reg_no: reg_no, class_id: elem.classId, program_id: elem.programId, semester: elem.semester, subject_id: elem.subjectId, elective_bbasket_id: elem.electivebasket })
            }
            return arr
        }, [])
        // console.log('complusaryData:', complusaryData)
        //console.log('checked subject:',checkedSubjects)
        let nonCompulsoryData = checkedSubjects.map(elem => ({ student_reg_no: reg_no, class_id: elem.classId, program_id: elem.programId, semester: elem.semester, subject_id: elem.subjectId, elective_bbasket_id: elem.electiveId }))

        const assignments = [...complusaryData, ...nonCompulsoryData];
        try {

            let { data } = await axios.post(`${baseURL}/api/studentsubjects/bulk`, { assignments })
            alert("Subjects assigned successfully!");

        }
        catch (err) {
            alert("Error assigning subjects. Please try again.");

        }
    }



    return (
        <div className="container">
            <FormWizard currentStep={step} />
            <div className="card p-10 shadow p-10">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <div className="d-flex" style={{ width: "70%" }}>
                        <h6>Select Program</h6>
                        <select class="form-select form-select-sm"
                            value={selectedProgram}
                            onChange={(e) => setSeletedProgram(e.target.value)}
                            aria-label="Default select example">
                            <option selected>Select Program</option>
                            {
                                programs.map(elem => (
                                    <option value={elem?.id}>{elem?.program_name}</option>
                                ))
                            }

                        </select>

                    </div >
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <div className="border" style={{ width: "70%" }}>
                        <h6 className="mb-10 mt-10">Complusary</h6>
                        <ul>
                            {
                                filterSubject.map(elem =>


                                    <li className="fw-bold px-2" >
                                        {elem.isCompulsory && elem?.subject?.value} {elem.isCompulsory && `(Sem ${elem?.semester})`}
                                    </li>

                                )
                            }
                        </ul>


                    </div>

                </div>


                {allOption.map((group, index) => (
                    <div key={index} className="border" style={{ width: "70%", margin: "auto" }}>

                        <h6 className="mt_10">Select Any  {group.opion[0]?.exactChoices}</h6>


                        <div className="d-flex flex-wrap gap-4 mt-2">
                            {group.opion.map((item, i) => (
                                <div key={i} className="form-check d-flex align-items-center gap-2">
                                    <input
                                        className="form-check-input mt-0"
                                        type="checkbox"
                                        id={`chk-${index}-${i}`}
                                        checked={checkedSubjects.some(s => s.subject === item.subject && s.electiveId === item.electiveId)}
                                        onChange={() => handleCheckboxChange(item, index)}
                                    />

                                    <label
                                        className="form-check-label fw-bold"
                                        htmlFor={`chk-${index}-${i}`}
                                    >
                                        {item.subject} <span className="text-muted">(Sem {item.semester})</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="d-flex justify-content-end gap-3 mb-10">
                    <button
                        type="Previous"
                        className="btn btn-success mt-3 px-5"
                        onClick={() => navigate(`/educational-detail-stage/?step=3`)}
                    >
                        Prev
                    </button>
                    <button
                        type="Next"
                        className="btn btn-success mt-3 px-5"
                        onClick={handleSubmit}
                    >
                        Next
                    </button>
                </div>





















            </div>
        </div>

    )

}
export default SubjectStage
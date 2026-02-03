import axios from "axios"
import { useState, useEffect } from "react"

import baseURL from "../../utils/baseUrl"
import { Button } from "react-bootstrap"
const SubjectStage = () => {
    const [subjects, setSubjects] = useState([])
    const [programs, setPrograms] = useState([])
    const [checkedSubjects, setCheckedSubjects] = useState([]);
    const [selectedProgram, setSeletedProgram] = useState('')
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
                console.log('******************getting error in subject')
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
            semester: item.semester
        });

        return acc;
    }, {});

    const allOption = Object.values(grouped).map(arr => ({
        opion: arr
    }));
   
    const handleSubmit=()=>{
        console.log('selected program',selectedProgram)
        console.log('checked subject:',checkedSubjects)

    }



    console.log('grouped data is:', allOption)
    return (
        <div className="card">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                <div className="d-flex" style={{ width: "50%" }}>
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
                <div className="border" style={{ width: "50%" }}>
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
                <div key={index} className="border" style={{ width: "50%", margin: "auto" }}>

                    <h6 className="mt_10">Select Any  {group.opion[0]?.exactChoices}</h6>


                    <div className="d-flex flex-wrap gap-4 mt-2">
                        {group.opion.map((item, i) => (
                            <div key={i} className="form-check d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    id={`chk-${index}-${i}`}
                                    value={item.electiveId || item.subject} // optional: good for form submission
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

         <div className="mt-10" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <div className="" style={{ width: "50%" }}>
                <Button className="btn btn-primary btn-sm px-20" onClick={handleSubmit}>Submit</Button>
            </div>

             
         </div>
        




















        </div>

    )

}
export default SubjectStage
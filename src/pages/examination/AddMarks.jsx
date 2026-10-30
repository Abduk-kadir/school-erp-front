import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import baseURL from '../../utils/baseUrl';
import { useSelector} from 'react-redux';
import { getResultMarkEntry } from '../../redux/slices/resultMarkEntry';

const AddMarks = () => {
   const [scheme,setScheme]=useState(null) 
   const [assessmentandcomponent,setAssessmentandComponent]=useState([])
   
   const {markentryid} =useParams()
   //console.log('markentryid is getting in add mark page',markentryid)
   const resultMarkEntry=useSelector((state)=>state.resultMarkEntry.marksentryvalue);

   useEffect(()=>{
    console.log('resultMarkEntry is getting in add mark page',resultMarkEntry)
    let fetchData=async()=>{
        try{
            const {data}=await axios.get(`${baseURL}/api/exam-schemes/${resultMarkEntry.exam_scheme_id}/assessment-and-components?subject_id=${resultMarkEntry.subject_id}`)
            console.log('data is getting in add mark page',data)
            setScheme(data?.data?.scheme)
            setAssessmentandComponent(data?.data?.assessments)
        }
        catch(error){

        }
    }
    fetchData();
   },[])

  return (
    <div className='container'>
       <div className='row'>
        <div className='col-3'>Exam Name:{scheme?.examNameInfo?.exam_name}-{scheme?.termInfo?.term_name}</div>
        <div className='col-3'>Class:{scheme?.classInfo?.class_name}</div>
        <div className='col-3'>Subject:{resultMarkEntry?.subjectInfo?.value}</div>
        <div className='col-3'>Term:{scheme?.termInfo?.term_name}</div>
       </div>
       
       {(() => {
        const groups = [];
        (assessmentandcomponent || []).forEach((assessment) => {
          let group = groups.find((g) => g.id === assessment.group_id);
          if (!group) {
            group = { id: assessment.group_id, name: assessment?.groupInfo?.group, assessments: [] };
            groups.push(group);
          }
          group.assessments.push(assessment);
        });

        const colCount = (assessment) => assessment.components?.length || 1;
        const groupColCount = (group) => group.assessments.reduce((sum, a) => sum + colCount(a), 0);
        const groupMax = (group) => group.assessments.reduce((sum, a) => sum + Number(a.max_marks || 0), 0);
        const grandMax = groups.reduce((sum, g) => sum + groupMax(g), 0);

        return (
          <div className='table-responsive mt-3'>
            <table className='table table-bordered text-center align-middle'>
              <thead>
                <tr>
                  <th rowSpan={3}>Sr No</th>
                  <th rowSpan={3}>Register ID | Student Name</th>
                  {groups.map((group) => (
                    <React.Fragment key={group.id}>
                      <th colSpan={groupColCount(group)}>{group.name} Marks</th>
                      <th rowSpan={3}>{group.name} Total Marks ({groupMax(group)})</th>
                    </React.Fragment>
                  ))}
                  <th rowSpan={3}>Grand Total ({grandMax})</th>
                </tr>
                <tr>
                  {groups.flatMap((group) =>
                    group.assessments.map((assessment) => (
                      <th
                        key={assessment.id}
                        colSpan={colCount(assessment)}
                        rowSpan={assessment.components?.length ? 1 : 2}
                      >
                        {assessment?.componentInfo?.component_name} ({Number(assessment.max_marks)})
                      </th>
                    ))
                  )}
                </tr>
                <tr>
                  {groups.flatMap((group) =>
                    group.assessments.flatMap((assessment) =>
                      (assessment.components || []).map((component) => (
                        <th key={component.id}>
                          {component?.componentInfo?.component_name} ({Number(component.max_marks)})
                        </th>
                      ))
                    )
                  )}
                </tr>
              </thead>
            </table>
          </div>
        );
       })()}


    </div>
  )
}

export default AddMarks
import GenericTableDataLayer from '../../../components/GenericTable';
import AssignedFined from '../../../components/child/feeMaster/AssignedFined';
const AssignedFinedPage=()=>{
    return(
        <div className='container'>
            <AssignedFined/>
            <GenericTableDataLayer
            
            url={'http://localhost:5000/api/fine-assigned'}
            columns={[
                {data:"id",name:"id",title:"ID"},
                {data:"class.class_name",name:"class_name",title:"Class Name"},
                {data:"student.first_name",name:"first_name",title:"First Name"},
              
                
                {data:"fine_amount",name:"fine_amount",title:"Fine Amount"},
                {data:"fine_pay_till_date",name:"fine_pay_till_date",title:"Fine Pay Till Date"},
            ]}
            />
           
        </div>
    )
}
export default AssignedFinedPage

import GenericTableDataLayer from "../../../components/GenericTable";
import AddSubject from "../../../components/child/subjectMaster/AddSubject";
import { useState } from "react";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

const SubjectPage = () => {
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/subjects/${id}`)
      alert('Subject is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message || error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit subject:", id);
    // open modal or set edit state
  };

  const handleSubmit = async (values) => {
        setTableRefreshKey((prev) => prev + 1);
};

  return (
    <>

              <AddSubject onParentSubmit={handleSubmit}/>
              <GenericTableDataLayer
                key={tableRefreshKey}
                pageName="Subjects"

                url={`${baseURL}/api/subjects`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"value",name:"value",title:"Subject Name"},
                  {data:"subject_code",name:"subject_code",title:"Subject Code"},
                  {data:"abbreviation_name",name:"abbreviation_name",title:"Abbreviation Name"},
                  {data:"status",name:"status",title:"Status"},
                  {
                    data: null,
                    title: "Actions",
                    orderable: false,
                    searchable: false,
                    render: (data, type, row) => {
                      return `
                                      <div class="table-action-group">
                                        <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit subject">Edit</button>
                                        <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete subject">Delete</button>
                                      </div>
                                    `;
                    },
                  },
                ]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                />



    </>
  );
};

export default SubjectPage;

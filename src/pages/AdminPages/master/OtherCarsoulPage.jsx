import React from 'react'
import AddCarsoul from '../../../components/child/master/AddCarsoul'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
import { useState } from 'react'

const OtherCarsoulPage = () => {
  const [tableRefreshKey, setTableRefreshKey] = useState(0)
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/othercrousal/${id}`)
      alert('Carsoul is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit batch:", id);
    // open modal or set edit state
  };

  const handleSubmit = async (values) => {
        setTableRefreshKey((prev) => prev + 1);
};
  return (
    <div>
      <AddCarsoul  pageName='other carsoul' onParentSubmit={handleSubmit}/>
      <GenericTableDataLayer key={tableRefreshKey} pageName="Carousel" url={`${baseURL}/api/othercrousal`} columns={[
        {data:"id",name:"id",title:"ID"},
        {
          data: "image_url",
          name: "image_url",
          title: "Image",
          orderable: false,
          searchable: false,
          render: (data, type) => {
            if (type !== "display") return data;
            if (!data) return '<span class="table-cell-empty">No image</span>';
            const src = data.startsWith("http") ? data : `${baseURL}${data}`;
            return `<img src="${src}" class="multipleimageshownintabe-img" alt="Carousel image" />`;
          },
        },
        
        {
          data: null,
          title: "Actions",
          orderable: false,
          searchable: false,
          render: (data, type, row) => {
            return `
                      <div class="table-action-group">
                        <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit institute">Edit</button>
                        <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete institute">Delete</button>
                      </div>
                    `;
          },
        },
        
       
      ]}
      onEdit={handleEdit}
      onDelete={handleDelete}
      />
    </div>
  )
}

export default OtherCarsoulPage
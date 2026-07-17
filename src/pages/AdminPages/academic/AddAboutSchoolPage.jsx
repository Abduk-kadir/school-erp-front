import React from 'react'
import AddAboutSchool from '../../../components/child/master/AddAboutSchool'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const AddAboutSchoolPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/about-institute/${id}`)
      alert('About school is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };
  const handleEdit = (id) => {
    console.log("Edit about school:", id);
    // open modal or set edit state
  };
  return (
    <div>
      <AddAboutSchool />
      <GenericTableDataLayer
        url={`${baseURL}/api/about-institute`}
        columns={[
          { data: 'id', name: 'id', title: 'ID' },
          { data: 'text', name: 'text', title: 'Text' },
          {
            data: 'images',
            name: 'images',
            title: 'Images',
            orderable: false,
            searchable: false,
            className: 'multipleimageshownintabe-col',
            render: (data, type) => {
              if (type !== 'display') return data;
              if (!Array.isArray(data) || data.length === 0) {
                return '<span class="table-cell-empty">No images</span>';
              }
              const imgs = data
                .map((item, index) => {
                  const path = item?.image;
                  if (!path) return '';
                  const src = path.startsWith('http') ? path : `${baseURL}${path}`;
                  return `<img src="${src}" class="multipleimageshownintabe-img" alt="School photo ${index + 1}" />`;
                })
                .filter(Boolean)
                .join('');
              return `<div class="multipleimageshownintabe">${imgs}</div>`;
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

export default AddAboutSchoolPage
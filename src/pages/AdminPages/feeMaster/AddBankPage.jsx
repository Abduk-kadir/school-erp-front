import React from 'react'
import AddBank from '../../../components/child/feeMaster/AddBank'

import GenericTableDataLayer from '../../../components/GenericTable'
const AddBankPage = () => {
  return (
    <div className='container mt-4'>

      <AddBank />
      <GenericTableDataLayer


        url={'http://localhost:5000/api/banks'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "bank_name", title: "Bank Name" },
          { data: "status", title: "Status" },

        ]}

      />

    </div>
  )
}

export default AddBankPage

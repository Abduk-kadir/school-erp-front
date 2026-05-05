import React from 'react'
import AddFeesType from '../../../components/child/feeMaster/AddFeesType'
import GenericTableDataLayer from '../../../components/GenericTable'

const FeeTypePage = () => {
  return (
    <div className='container'>
      <AddFeesType/>
      <GenericTableDataLayer


        url={'http://localhost:5000/api/fees-types'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "name", title: "Fees Type" },
          

        ]}

      />

    </div>
  )
}

export default FeeTypePage

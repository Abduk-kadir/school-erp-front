import React from 'react'
import AddBankDetail from '../../../components/child/feeMaster/AddBankDetail'
import GenericTableDataLayer from '../../../components/GenericTable'

const BankDetailPage = () => {
  return (
    <div className='container'>
      <AddBankDetail/>
      <GenericTableDataLayer


        url={'http://localhost:5000/api/bank-details'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "bank.bank_name", title: "Bank Name" },
          { data: "account_number", title: "Account Number" },
          { data: "ifsc_code", title: "Ifsc code" },

        ]}

      />

    </div>
  )
}

export default BankDetailPage

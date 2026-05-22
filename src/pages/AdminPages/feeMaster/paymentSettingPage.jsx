import React from 'react'
import PaymentSetting from '../../../components/child/feeMaster/paymentSetting'
import GenericTableDataLayer from '../../../components/GenericTable'

const PaymentSettingPage = () => {
  return (
    <div>
      <PaymentSetting />
      <GenericTableDataLayer
        url={'http://localhost:5000/api/payment-settings'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "paymentGateway", title: "Payment Gateway" },
          { data: "class.class_name", title: "Class" ,defaultContent:""},
          { data: "merchantId", title: "Merchant ID" },
          { data: "key", title: "Key" },
          { data: "accessCode", title: "Access Code" },
          { data: "feeType.name", title: "Fee Type" },
          { data: "isSplit", title: "Is Split" },
        ]}
      />
    </div>
  )
}

export default PaymentSettingPage
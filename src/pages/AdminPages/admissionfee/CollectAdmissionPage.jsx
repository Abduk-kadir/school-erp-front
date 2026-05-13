import React from 'react'

import Breadcrumb from '../../../components/Breadcrumb'
import CollectAcadmicFee2 from '../../../components/child/academicFee/CollectAcadmicFee2'

const CollectAdmissionPage = () => {
  return (
    <>
     
      <CollectAcadmicFee2 feetypeid={2} apiurl='/api/admission-fees/fee-collection' feeLabel="Admission Fee"/>
    </>
  )
}

export default CollectAdmissionPage
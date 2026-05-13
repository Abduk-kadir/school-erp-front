import React from 'react'

import Breadcrumb from '../../../components/Breadcrumb'
import CollectAcadmicFee2 from '../../../components/child/academicFee/CollectAcadmicFee2'

const AcademicFeeCollectPage = () => {
  return (
    <>
     
      <CollectAcadmicFee2 feetypeid={3} apiurl="/api/student-fees/fee-collection" feeLabel="Academic Fee"/>
    </>
  )
}

export default AcademicFeeCollectPage
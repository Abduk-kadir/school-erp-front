import React from 'react'

import Breadcrumb from '../../../components/Breadcrumb'
import CollectAcadmicFee2 from '../../../components/child/academicFee/CollectAcadmicFee2'

const CollectCanteenFeePage = () => {
  return (
    <>
     
      <CollectAcadmicFee2 feetypeid={4} apiurl='/api/canteen-fees/fee-collection' feeLabel="Canteen Fee"/>
    </>
  )
}

export default CollectCanteenFeePage
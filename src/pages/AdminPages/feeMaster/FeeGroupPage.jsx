import React from "react";
import AddGroup from "../../../components/child/feeMaster/AddGroup";
import GenericTableDataLayer from "../../../components/GenericTable";
const FeeGroupPage = () => {
  return (
    <div className="container">
      <AddGroup className="mb-10" />
      <GenericTableDataLayer columns={[
        {data:"id",title:"ID"},
        {data:"groupname",title:"Group Name"},
     
      ]} url="http://localhost:5000/api/fee-groups" />
    </div>
  );
};

export default FeeGroupPage;

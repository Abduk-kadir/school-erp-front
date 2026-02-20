const Form_Status = (form_status) => {
  const status = {
    0: "In Process",
    1: "Accepted",
    2: "Rejected",
    4: "Edit By Student",
   
  };

  return status[form_status] || "Unknown";
};

export default Form_Status;
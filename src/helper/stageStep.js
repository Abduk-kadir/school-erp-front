const Stage_accordingStep = (step) => {
  const stages = {
    1: "Registration",
    2: "Personal Information",
    3: "Education Detail",
    4: "Subject",
    5: "Parent Particulars",
    6: "Transport",
    7: "Other Information",
    8: "Declaration",
    9: "Document",
    10: "Complete"
  };

  return stages[step] || "Unknown";
};

export default Stage_accordingStep;
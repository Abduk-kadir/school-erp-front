import DeclarationEditor from "./DeclarationEditor";
import axios from "axios";
import baseURL from "../../../../utils/baseUrl";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../../../../assets/css/mastercom.css";
import "../../../../assets/css/declaration.css";

const DeclarationStatement = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/classes`);
        setClasses(data?.data || []);
      } catch (err) {
        console.log("not getting class data");
      }
    };
    fetchData();
  }, []);

  const handleSaveDeclaration = async (htmlContent) => {
    if (!selectedClass) {
      alert("Please select a class first.");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/declarations`, {
        class_id: Number(selectedClass),
        content: htmlContent,
      });
      alert("Declaration is saved successfully");
    } catch (err) {
      alert("Declaration saving error");
    }
  };

  return (
    <div className="chfi-wrapper declaration-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:document-text-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Declaration Statement</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area declaration-form-area chfi-root">
            <div className="field-row">
              <label className="form-label" htmlFor="declaration-class">
                <span className="label-dot" />
                Select Class
              </label>

              <div className="icon-field">
                <span className="icon">
                  <Icon
                    icon="solar:square-academic-cap-bold-duotone"
                    width="18"
                  />
                </span>
                <select
                  id="declaration-class"
                  className="form-select"
                  name="selectedClass"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Select class</option>
                  {classes.map((elem) => (
                    <option key={elem.id} value={elem.id}>
                      {elem.class_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DeclarationEditor
              onSave={handleSaveDeclaration}
              disabled={!selectedClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclarationStatement;

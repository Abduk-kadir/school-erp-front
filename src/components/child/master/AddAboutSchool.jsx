import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import DeclarationEditor from "./Declaration/DeclarationEditor";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/declaration.css";

const AddAboutSchool = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDeclaration = async (htmlContent) => {
    const formData = new FormData();
    formData.append("text", htmlContent);
    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post(`${baseURL}/api/about-institute`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("About school saved successfully");
      setImages([]);
      setEditorKey((k) => k + 1);
    } catch (err) {
      console.error("About school save failed:", err);
      alert(err?.response?.data?.message||err?.message);
    }
  };

  return (
    <div className="chfi-wrapper declaration-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:buildings-2-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add About School</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area declaration-form-area chfi-root">
            <div className="school-photos-section">
              <div className="field-row">
                <label className="form-label" htmlFor="school-photos">
                  <span className="label-dot" />
                  School Photos
                </label>
                <div className="icon-field">
                  <span className="icon">
                    <Icon icon="solar:gallery-bold-duotone" width="18" />
                  </span>
                  <input
                    id="school-photos"
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <p className="school-photos-hint">
                Select multiple photos for the school gallery.
              </p>

              {previews.length > 0 && (
                <div className="school-photos-preview-grid">
                  {previews.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="school-photo-preview-item"
                    >
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="school-photo-preview-img"
                      />
                      <button
                        type="button"
                        className="school-photo-remove-btn"
                        aria-label="Remove image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DeclarationEditor
              key={editorKey}
              onSave={handleSaveDeclaration}
              heading="About School Content"
              placeholder="Write about your school — history, mission, facilities..."
              hint="Use the toolbar to format text. Photos and content are saved together."
              saveLabel="Save About School"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAboutSchool;

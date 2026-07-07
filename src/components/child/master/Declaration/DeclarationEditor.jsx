import { useState } from "react";
import ReactQuill from "react-quill";
import { Icon } from "@iconify/react/dist/iconify.js";
import "react-quill/dist/quill.snow.css";

const EDITOR_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const EDITOR_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "link",
];

const DeclarationEditor = ({
  onSave,
  disabled = false,
  heading = "Declaration Content",
  placeholder = "Write the declaration statement for the selected class...",
  hint = "Use the toolbar to format text. Select a class before saving.",
  saveLabel = "Save Declaration",
}) => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim() || content === "<p><br></p>") {
      alert("Declaration cannot be empty!");
      return;
    }
    if (onSave) {
      onSave(content);
    }
  };

  const handleClear = () => {
    setContent("");
  };

  return (
    <div className="declaration-editor-section">
      <div className="declaration-editor-heading">
        <span className="label-dot" />
        {heading}
      </div>

      <div className="declaration-editor-wrap">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={EDITOR_MODULES}
          formats={EDITOR_FORMATS}
          placeholder={placeholder}
        />
      </div>

      {hint ? <p className="declaration-editor-hint">{hint}</p> : null}

      <div className="declaration-editor-actions">
        <button
          type="button"
          className="btn btn-reset"
          onClick={handleClear}
          disabled={!content}
        >
          <Icon icon="solar:restart-bold-duotone" width="16" />
          Clear
        </button>
        <button
          type="button"
          className="btn btn-submit"
          onClick={handleSave}
          disabled={disabled}
        >
          <Icon icon="solar:diskette-bold-duotone" width="18" />
          {saveLabel}
        </button>
      </div>
    </div>
  );
};

export default DeclarationEditor;

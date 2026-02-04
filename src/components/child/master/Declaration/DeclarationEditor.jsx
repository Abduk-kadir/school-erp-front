import React, { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const DeclarationEditor = ({ onSave }) => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) {
      alert("Declaration cannot be empty!");
      return;
    }
    if (onSave) {
      onSave(content); // Pass HTML content to parent
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
     

      {/* Editor Container */}
      <div style={{ border: "1px solid #ccc", borderRadius: 5, overflow: "hidden" }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ],
          }}
          formats={[
            'header', 'bold', 'italic', 'underline', 'strike',
            'list', 'bullet', 'align', 'link', 'image'
          ]}
          style={{ height: 300 }}
        />
      </div>

      {/* Save Button */}
      <div style={{ textAlign: "right", marginTop: 15 }}>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 25px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            zIndex: 10,
            position: "relative"
          }}
        >
          Save Declaration
        </button>
      </div>
    </div>
  );
};

export default DeclarationEditor;

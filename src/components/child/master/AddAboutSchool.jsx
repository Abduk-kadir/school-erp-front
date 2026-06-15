import { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
import DeclarationEditor from './Declaration/DeclarationEditor';

const AddAboutSchool = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDeclaration = async (htmlContent) => {
    const formData = new FormData();
    formData.append('text', htmlContent);
    images.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await axios.post(`${baseURL}/api/about-institute`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('About school saved successfully');
      setImages([]);
    } catch (err) {
      console.error('About school save failed:', err);
      alert('About school saving error');
    }
  };

  return (
    <div className="container-fluid" style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h4 className="mb-3">Add About School</h4>

      <div className="mb-4">
        <label className="form-label fw-semibold">School Photos</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <small className="text-muted d-block mt-1">
          Select multiple photos for the school gallery.
        </small>

        {previews.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            {previews.map((src, index) => (
              <div key={`${src}-${index}`} style={{ position: 'relative' }}>
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #dee2e6',
                  }}
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => removeImage(index)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    border: 'none',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    background: '#dc3545',
                    color: '#fff',
                    fontSize: 14,
                    lineHeight: 1,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeclarationEditor onSave={handleSaveDeclaration} />
    </div>
  );
};

export default AddAboutSchool;

function DocumentViewer({ url, show, onClose }) {
  if (!show || !url) return null

  const extension = url.split('.').pop().split('?')[0].toLowerCase()
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)
  const isPdf = extension === 'pdf'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '0.5rem',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            zIndex: 1,
            border: 'none',
            background: '#333',
            color: '#fff',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            cursor: 'pointer',
            fontSize: '1.25rem',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {isImage && (
          <img
            src={url}
            alt='Document'
            style={{ display: 'block', width: '100%', maxHeight: '85vh', objectFit: 'contain' }}
          />
        )}

        {isPdf && (
          <iframe
            src={url}
            title='PDF'
            style={{ display: 'block', width: '100%', height: '85vh', border: 'none' }}
          />
        )}

        {!isImage && !isPdf && (
          <p style={{ padding: '2rem', margin: 0 }}>Unsupported file type</p>
        )}
      </div>
    </div>
  )
}

export default DocumentViewer

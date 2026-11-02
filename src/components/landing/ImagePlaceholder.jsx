import React, { useEffect, useState } from 'react';
import { HiOutlinePhotograph, HiX } from 'react-icons/hi';

export default function ImagePlaceholder({ src, title, detail, minHeight }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const showImage = Boolean(src) && !imageFailed;

  useEffect(() => {
    if (!previewOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setPreviewOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewOpen]);

  return (
    <>
      <figure className={`landing-image${showImage ? ' has-image' : ''}`}>
        {showImage ? (
          <button
            type="button"
            className="landing-image__preview-button"
            onClick={() => setPreviewOpen(true)}
            aria-label={`View ${title} full size`}
          >
            <img
              className="landing-image__img"
              src={src}
              alt={title}
              loading="lazy"
              onError={() => setImageFailed(true)}
              style={minHeight ? { minHeight } : undefined}
            />
            <span className="landing-image__zoom">View screenshot</span>
          </button>
        ) : (
          <div
            className="img-placeholder"
            style={minHeight ? { minHeight } : undefined}
          >
            <HiOutlinePhotograph className="ph-icon" />
            <div className="ph-title">{title}</div>
            <div className="ph-detail">{detail}</div>
            {src && (
              <code className="landing-image__path">
                Add image at: public{src}
              </code>
            )}
          </div>
        )}
      </figure>

      {previewOpen && showImage && (
        <div
          className="landing-image-viewer"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewOpen(false);
          }}
        >
          <div
            className="landing-image-viewer__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <button
              type="button"
              className="landing-image-viewer__close"
              onClick={() => setPreviewOpen(false)}
              aria-label="Close image preview"
            >
              <HiX />
            </button>
            <img src={src} alt={title} />
            <p>{title}</p>
          </div>
        </div>
      )}
    </>
  );
}

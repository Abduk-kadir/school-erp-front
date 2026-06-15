import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
import '../../../assets/css/aboutschool.css';

const AboutSchool = () => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutSchool = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/about-institute`);
        const record = response?.data?.data?.[0];
        setText(record?.text || '');
        setImages(record?.images || []);
      } catch (error) {
        setText('');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutSchool();
  }, []);

  const imageUrls = images
    .map((item) => item?.image)
    .filter(Boolean)
    .map((path) => `${baseURL}${path}`);

  const hasHtmlText = (html) => {
    if (!html) return false;
    return html.replace(/<[^>]*>/g, '').trim().length > 0;
  };

  const showText = hasHtmlText(text);

  return (
    <div className="about-school-page">
      <h4 className="about-school-page__title">
        <span className="about-school-page__title-icon" aria-hidden="true">
          <Icon icon="solar:buildings-2-bold-duotone" />
        </span>
        About School
      </h4>

      {loading ? (
        <div className="about-school-page__loading">Loading about school...</div>
      ) : !showText && imageUrls.length === 0 ? (
        <div className="about-school-page__empty">
          <Icon
            icon="solar:buildings-2-bold-duotone"
            className="about-school-page__empty-icon"
          />
          No information available yet
        </div>
      ) : (
        <div className="about-school-page__card">
          <div className="about-school-page__carousel-wrap">
            {imageUrls.length > 0 ? (
              <>
                {imageUrls.length > 1 && (
                  <span className="about-school-page__image-count">
                    {imageUrls.length} photos
                  </span>
                )}
                <Carousel
                  className="about-school-page__carousel"
                  indicators={imageUrls.length > 1}
                  controls={imageUrls.length > 1}
                  interval={4500}
                  pause="hover"
                  fade
                >
                  {imageUrls.map((url, index) => (
                    <Carousel.Item key={url}>
                      <img
                        src={url}
                        alt={`School ${index + 1}`}
                        className="about-school-page__carousel-image"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </>
            ) : (
              <div className="about-school-page__placeholder-image">
                <Icon icon="solar:gallery-bold-duotone" />
                No images uploaded
              </div>
            )}
          </div>

          {showText && (
            <div className="about-school-page__content">
              <div className="about-school-page__content-header">
                <span className="about-school-page__content-icon" aria-hidden="true">
                  <Icon icon="solar:document-text-bold-duotone" />
                </span>
                <span className="about-school-page__content-label">About our institute</span>
              </div>
              <div
                className="about-school-page__text"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutSchool;

import React, { useState, useEffect } from 'react';
import baseURL from '../../../utils/baseUrl';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import '../../../assets/css/diary.css';

const EmerencyContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const reg_no = localStorage.getItem('reg_no');

  useEffect(() => {
    const fetchContacts = async () => {
      if (!reg_no) {
        setContacts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}/api/batches/student/${reg_no}`
        );
        setContacts(response?.data?.data || []);
      } catch (error) {
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [reg_no]);

  return (
    <div className="container-fluid diary-page diary-page--plain diary-page--emergency-contact">
      <h4 className="diary-page__title">
        <span className="diary-page__title-icon diary-page__title-icon--emergency-call">
          <Icon icon="solar:phone-calling-bold-duotone" />
        </span>
        Emergency Contact
      </h4>

      <div className="row diary-page__list">
        <div className="diary-page__cards">
          {loading ? (
            <div className="diary-page__empty">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="diary-page__empty">No emergency contact found</div>
          ) : (
            contacts.map((item, index) => (
              <div className="card diary-card" key={item?.id ?? index}>
                <div className="card-header diary-card__header">
                  <span className="diary-card__subject">
                    <span
                      className="diary-card__icon-badge diary-card__icon-badge--subject"
                      aria-hidden="true"
                    >
                      <Icon icon="solar:user-id-bold-duotone" className="diary-card__subject-icon" />
                    </span>
                    <span className="diary-card__subject-text">Contact Detail</span>
                  </span>
                </div>

                <div className="card-body diary-card__body emergency-contact-card__body">
                  <div className="emergency-contact-row">
                    <span className="emergency-contact-row__label">Contact Person</span>
                    <span className="emergency-contact-row__value">
                      {item?.personname || '—'}
                    </span>
                  </div>
                  <div className="emergency-contact-row">
                    <span className="emergency-contact-row__label">Number</span>
                    <span className="emergency-contact-row__value">
                      {item?.contactperson ? (
                        <a
                          href={`tel:${item.contactperson}`}
                          className="emergency-contact-row__phone"
                        >
                          <Icon icon="solar:phone-calling-bold-duotone" width={24} />
                          {item.contactperson}
                        </a>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmerencyContact;

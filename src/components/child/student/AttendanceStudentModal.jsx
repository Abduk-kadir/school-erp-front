import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatTime = (value) => {
  if (!value || value === '00:00:00') return '—'
  return value.slice(0, 5)
}

const AttendanceStudentModal = ({ data, onClose }) => {
  if (!data?.attendance_date) return null

  return (
    <div className='attendance-modal' onClick={onClose}>
      <div className='attendance-modal__box' onClick={(e) => e.stopPropagation()}>
        <div className='attendance-modal__head'>
          <Icon icon='solar:clipboard-check-bold-duotone' className='attendance-modal__head-icon' />
          <h5 className='attendance-modal__title'>Day Attendance</h5>
          <button type='button' className='attendance-modal__close' onClick={onClose} aria-label='Close'>
            ×
          </button>
        </div>

        <div className='attendance-modal__body'>
          <div className='attendance-modal__row'>
            <span className='attendance-modal__label'>
              <Icon icon='solar:user-id-bold-duotone' width={18} />
              Reg No
            </span>
            <span className='attendance-modal__value'>{data?.reg_no ?? '—'}</span>
          </div>
          <div className='attendance-modal__row'>
            <span className='attendance-modal__label'>
              <Icon icon='solar:calendar-bold-duotone' width={18} />
              Date
            </span>
            <span className='attendance-modal__value'>{formatDate(data.attendance_date)}</span>
          </div>
          <div className='attendance-modal__row attendance-modal__row--in'>
            <span className='attendance-modal__label'>
              <Icon icon='solar:login-3-bold-duotone' width={18} />
              In Time
            </span>
            <span className='attendance-modal__value attendance-modal__value--in'>
              {formatTime(data.in_time)}
            </span>
          </div>
          <div className='attendance-modal__row attendance-modal__row--out'>
            <span className='attendance-modal__label'>
              <Icon icon='solar:logout-3-bold-duotone' width={18} />
              Out Time
            </span>
            <span className='attendance-modal__value attendance-modal__value--out'>
              {formatTime(data.out_time)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceStudentModal

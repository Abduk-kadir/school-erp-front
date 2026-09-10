import React, { useCallback, useMemo, useState,useEffect } from 'react'
import baseURL from '../../../utils/baseUrl'
import StudentTable from '../../../components/child/academic/StudentTable'
import '../../../assets/css/editdelete.css'
import '../../../assets/css/studentlistcss.css'
import GenericformModal from '../../../components/child/GenericformModal'
import axios from 'axios'

const StudentPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [classDivision, setClassDivision] = useState([])
  const [allDivisions, setAllDivisions] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [tableRefreshKey, setTableRefreshKey] = useState(0)
  const [initialValues, setInitialValues] = useState({
    id: '',
    first_name: '',
    last_name: '',
    father_name: '',
    mother_name: '',
    rollnumber: '',
    division_id: '',
    email: '',
    contact_number: '',
    address: '',
    rfid: '',
    blood_groop:''

  })

  const initialFields = [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter First Name',
      icon: 'solar:user-bold-duotone',
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter Last Name',
      icon: 'solar:user-bold-duotone',
    },
    {
      name: 'father_name',
      label: 'Father Name',
      type: 'text',
      required: true,
      placeholder: 'Enter Father Name',
      icon: 'solar:users-group-rounded-bold-duotone',
    },
    {
      name: 'mother_name',
      label: 'Mother Name',
      type: 'text',
      required: true,
      placeholder: 'Enter Mother Name',
      icon: 'solar:users-group-rounded-bold-duotone',
    },
    {
      name: 'rollnumber',
      label: 'Roll Number',
      type: 'text',
      required: true,
      placeholder: 'Enter Roll Number',
      icon: 'solar:hashtag-square-bold-duotone',
    },
    {
      name: 'division_id',
      label: 'Division',
      type: 'select',
      required: true,
      placeholder: 'Select Division',
      icon: 'solar:widget-bold-duotone',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: false,
      placeholder: 'Enter Email',
      icon: 'solar:letter-bold-duotone',
    },
    {
      name: 'contact_number',
      label: 'Registered Contact Number',
      type: 'text',
      required: true,
      placeholder: 'Enter Contact Number',
      icon: 'solar:phone-calling-rounded-bold-duotone',
    },{
      name: 'blood_groop',
      label: 'Blood Groop',
      type: 'text',
      required: false,
      placeholder: 'Enter Blood Groop',
      icon: 'solar:blood-drop-bold-duotone',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
      placeholder: 'Enter Address',
      icon: 'solar:map-point-bold-duotone',
    },
    {
      name: 'rfid',
      label: 'RFID',
      type: 'text',
      required: true,
      placeholder: 'Enter RFID',
      icon: 'solar:card-bold-duotone',
    },
  ]

  const mapDivisions = (list) =>
    list.map((item) => ({
      id: item.divisionInfo?.id ?? item.divisionid,
      name: item.divisionInfo?.division_name ?? '',
    }))

  useEffect(() => {
    axios.get(`${baseURL}/api/class-div-map-masters`).then((res) => {
      const payload = res.data
      setClassDivision(
        Array.isArray(payload) ? payload : payload?.data || []
      )
    })
  }, [])

  const changeDetail = useCallback(
    (row) => {
      const classId = row.class_id ?? row.classid ?? row.classInfo?.id
      const className = row.classInfo?.class_name || row.class_name || ''

      let divisions = mapDivisions(
        classDivision.filter((item) => String(item.classid) === String(classId))
      )
      if (!divisions.length && className) {
        divisions = mapDivisions(
          classDivision.filter((item) => item.classInfo?.class_name === className)
        )
      }

      const divisionId =
        row.division_id ??
        row.divisionid ??
        row.divisionInfo?.id ??
        divisions.find(
          (d) =>
            d.name ===
            (row.divisionInfo?.division_name || row.division_name || row.division)
        )?.id ??
        ''

      setAllDivisions(divisions)
      setSuccessMsg('')
      setErrorMsg('')
      setInitialValues({
        id: row.id,
        first_name: row.first_name || '',
        last_name: row.last_name || '',
        father_name: row.father_name || row.father || '',
        mother_name: row.mother_name || row.mother || '',
        rollnumber: row.rollnumber ?? row.roll_no ?? '',
        division_id: divisionId === '' || divisionId == null ? '' : String(divisionId),
        email: row.email || '',
        password: row.password || '',
        contact_number: row.contact_number || '',
        address: row.address || '',
        rfid: row.rfid || '',
      })
      setShowModal(true)
    },
    [classDivision]
  )

  const modalFields = useMemo(
    () =>
      initialFields.map((field) =>
        field.name === 'division_id'
          ? {
              ...field,
              options: allDivisions.map((d) => ({
                value: String(d.id),
                label: d.name,
              })),
            }
          : field
      ),
    [allDivisions]
  )

  const studentColumns = useMemo(
    () => [
      { data: "id", name: "id", title: "ID" },
      { data: "reg_no", title: "Reg No" },
      {
        data: "first_name",
        title: `<div class="sl-stack">
      <span class="text-danger">First Name</span>
      <span class="text-primary">Last Name</span>
      <span class="text-success">Father Name</span>
      <span class="text-purple">Mother Name</span>
    </div>`,
        render: (data, type, row) => `
      <div class="sl-stack">
        <span class="text-danger">${row.first_name || ''}</span>
        <span class="text-primary">${row.last_name || ''}</span>
        <span class="text-success">${row.father_name || row.father || ''}</span>
        <span class="text-purple">${row.mother_name || row.mother || ''}</span>
      </div>
    `,
      },
      {
        data: null,
        title: "Photo",
        orderable: false,
        searchable: false,
        render: () => `
      <div class="table-action-group">
        <button type="button" class="table-action-btn table-action-view-document" title="View photo">View Photo</button>
      </div>
    `,
      },
      {
        data: "class",
        title: `<div class="sl-stack">
      <span class="text-danger">Class</span>
      <span class="text-primary">Div</span>
      <span class="text-success">Roll NO</span>
      <span class="text-purple">Gr No</span>
    </div>`,
        render: (data, type, row) => {
          const className =
            row.classInfo?.class_name ||
            (typeof row.class === 'object' ? row.class?.class_name : row.class) ||
            row.class_name ||
            ''
          const division =
            row.divisionInfo?.division_name ||
            row.division ||
            row.division_name ||
            ''
          return `
      <div class="sl-stack">
        <span class="text-danger">${className}</span>
        <span class="text-primary">${division}</span>
        <span class="text-success">${row.rollnumber || ''}</span>
        <span class="text-purple">${row.gr_no || ''}</span>
      </div>
    `
        },
      },
      {
        data: "email",
        title: `<div class="sl-stack">
      <span class="text-danger">Email</span>
      <span class="text-primary">Mobile No</span>
      <span class="text-success">Password</span>
    </div>`,
        render: (data, type, row) => `
      <div class="sl-stack">
        <span class="text-danger">${row.email || ''}</span>
        <span class="text-primary">${row.contact_number || row.mobile_no || row.mobile || ''}</span>
        <span class="text-success">${row.password || ''}</span>
      </div>
    `,
      },
      {
        data: null,
        title: `<div class="sl-stack">
      <span class="text-danger">Is Taken Bus</span>
      <span class="text-primary">Route Name</span>
      <span class="text-success">Sub Route Name</span>
    </div>`,
        orderable: false,
        searchable: false,
        render: (data, type, row) => {
          const isTaken =
            row.is_taken ||
            row.transport?.is_taken ||
            row.TransportDetail?.is_taken ||
            ''
          const routeName =
            row.Route?.route_name ||
            row.route_name ||
            row.transport?.Route?.route_name ||
            ''
          const subRouteName =
            row.SubRoute?.sub_route_name ||
            row.sub_route_name ||
            row.transport?.SubRoute?.sub_route_name ||
            ''
          return `
      <div class="sl-stack">
        <span class="text-danger">${isTaken}</span>
        <span class="text-primary">${routeName}</span>
        <span class="text-success">${subRouteName}</span>
      </div>
    `
        },
      },
      {
        data: null,
        title: "Action",
        orderable: false,
        searchable: false,
        render: (data, type, row) => `
      <div class="table-action-group sl-actions">
        <button type="button" class="table-action-btn table-action-edit" title="Edit by Staff">Edit by Staff</button>
        <button type="button" class="table-action-btn table-action-download-document" title="Download PDF">Download PDF</button>
        <button type="button" class="table-action-btn table-action-change-detail" data-id="${row.id}" title="Change Detail">Change Detail</button>
      </div>
    `,
      },
    ],
    []
  )
  const handleSubmit = async (values) => {
    setSuccessMsg('')
    setErrorMsg('')
    try {
      const { division_id, ...rest } = values
      const payload = { ...rest, division: division_id }
       console.log('payload is:',payload)
      await axios.put(
        `${baseURL}/api/parmanent-personal-information/${initialValues.id}`,
        payload
      )
      setSuccessMsg('Student details updated successfully!')
      setTableRefreshKey((prev) => prev + 1)
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="student-list-page">
      {showModal && (
        <GenericformModal
          show={showModal}
          initialValues={initialValues}
          initialFields={modalFields}
          cardTitle="Change Detail"
          cardIcon="solar:pen-new-square-bold-duotone"
          onSubmit={handleSubmit}
          submitButtonText="Update"
          successMsg={successMsg}
          errorMsg={errorMsg}
          setSuccessMsg={setSuccessMsg}
          setErrorMsg={setErrorMsg}
          onClose={() => {
            setShowModal(false)
            setSuccessMsg('')
            setErrorMsg('')
          }}
        />
      )}
      <StudentTable
        key={tableRefreshKey}
        url={`${baseURL}/api/parmanent-personal-information`}
        columns={studentColumns}
        onEdit={changeDetail}
      />
    </div>
  )
}

export default StudentPage

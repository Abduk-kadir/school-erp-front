import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStaffId } from "../redux/slices/dynamicForm/editByStaffSlice";
import { getPersonalInformationForm } from '../redux/slices/dynamicForm/personalInfoFormSlice';
import { setRegistrationNo } from "../redux/slices/registrationNo";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../assets/css/academicOfflineFeeReport.css";

const AcadmicAllTransactionReportDataTable = ({
  url,
  columns,
  loadingFun,
  exportBaseUrl,
}) => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const tableRef = useRef(null);
  const datatableRef = useRef(null);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [discountTypes, setDiscountTypes] = useState([]);

  // Controlled filter values
  const [classFilter, setClassFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [paymentModeFilter, setPaymentModeFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("");

  const [exportingFormat, setExportingFormat] = useState(null);

  /** Same as AcadmicOfflineFeeReportDataTable — dedicated paths; filters in query. */
  const getExportUrl = (format) => {
    if (exportBaseUrl) return exportBaseUrl;
    if (format === "excel") return `${baseURL}/api/fees/excel`;
    if (format === "csv") return `${baseURL}/api/fees/csv`;
    if (format === "pdf") return `${baseURL}/api/fees/pdf`;
    return `${String(url).replace(/\/$/, "")}/export`;
  };

  // Refs to hold current filter values for DataTable ajax
  const classFilterRef = useRef("");
  const fromDateRef = useRef("");
  const toDateRef = useRef("");
  const batchFilterRef = useRef("");
  const divisionFilterRef = useRef("");
  const paymentModeFilterRef = useRef("");
  const paymentStatusFilterRef = useRef("");
  const discountTypeFilterRef = useRef("");

  // Update refs when state changes
  useEffect(() => {
    classFilterRef.current = classFilter;
  }, [classFilter]);

  useEffect(() => {
    fromDateRef.current = fromDate;
  }, [fromDate]);

  useEffect(() => {
    toDateRef.current = toDate;
  }, [toDate]);

  useEffect(() => {
    batchFilterRef.current = batchFilter;
  }, [batchFilter]);

  useEffect(() => {
    divisionFilterRef.current = divisionFilter;
  }, [divisionFilter]);

  useEffect(() => {
    paymentModeFilterRef.current = paymentModeFilter;
  }, [paymentModeFilter]);

  useEffect(() => {
    paymentStatusFilterRef.current = paymentStatusFilter;
  }, [paymentStatusFilter]);

  useEffect(() => {
    discountTypeFilterRef.current = discountTypeFilter;
  }, [discountTypeFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3, resDiscount] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/divisions`)
         
        ]);
        setClasses(res1?.data?.data || []);
        setDivisions(res2?.data?.data || []);
        setBatches(res3?.data?.data || []);
        const rawDiscount =
          resDiscount?.data?.data ?? resDiscount?.data ?? [];
        setDiscountTypes(Array.isArray(rawDiscount) ? rawDiscount : []);
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    if (datatableRef.current) {
      datatableRef.current.draw(); // ← this triggers new ajax call
    }
  };

  const getReportFiltersForExport = () => ({
    className: classFilterRef.current.trim(),
    fromDate: fromDateRef.current.trim(),
    toDate: toDateRef.current.trim(),
    batchId: batchFilterRef.current.trim(),
    divisionId: divisionFilterRef.current.trim(),
    paymentMode: paymentModeFilterRef.current.trim(),
    paymentStatus: paymentStatusFilterRef.current.trim(),
    discountTypeId: discountTypeFilterRef.current.trim(),
  });

  const triggerFileDownload = (blob, filename) => {
    const href = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(href);
  };

  const handleExportDownload = async (format) => {
    const ext =
      format === "excel" ? "xlsx" : format === "csv" ? "csv" : "pdf";
    const filename = `fee-report-${format}-${Date.now()}.${ext}`;
    try {
      setExportingFormat(format);
      if (typeof loadingFun === "function") loadingFun(true);
      const filters = getReportFiltersForExport();
      const dedicated =
        !exportBaseUrl &&
        (format === "excel" || format === "csv" || format === "pdf");
      const params = new URLSearchParams();
      if (!dedicated) params.set("format", format);
      Object.entries(filters).forEach(([key, value]) => {
        const v = value == null ? "" : String(value).trim();
        if (v !== "") params.set(key, v);
      });
      const qs = params.toString();
      const exportUrl = getExportUrl(format);
      const { data } = await axios.get(qs ? `${exportUrl}?${qs}` : exportUrl, {
        responseType: "blob",
      });
      triggerFileDownload(data, filename);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportingFormat(null);
      if (typeof loadingFun === "function") loadingFun(false);
    }
  };

  const handleAccept = async (data) => {
    console.log('handle accept is calling')
    try {
      console.log('data is:', data)
      let res = await axios.put(`${baseURL}/api/admission-conform/updateStatus`, {
        reg_no: Number(data.reg_no)
      });

      console.log('api is called')
      if (datatableRef.current) {
        datatableRef.current.draw(); // ← this triggers new ajax call
      }

    }
    catch (err) {

    }



  }

  const handleEditByStudent = async (data) => {

    try {
      console.log('data is:', data)
      let res = await axios.put(`${baseURL}/api/admission-conform/editbystudent`, {
        reg_no: Number(data.reg_no)
      });

      console.log('api is called')
      if (datatableRef.current) {
        datatableRef.current.draw(); // ← this triggers new ajax call
      }

    }
    catch (err) {

    }


  }

  const handleEditByStaff = async (data) => {

    try {
       Promise.all([
                 dispatch(getPersonalInformationForm({})),
       dispatch(setRegistrationNo({ reg_no:data?.reg_no })),
       dispatch(setStaffId({ staff_id:2 }))
      
                 ])
   
      navigate(`/personal-information?step=${2}&reg_no=${data?.reg_no}`)
      console.log('data is:', data)
    

      

    }
    catch (err) {

    }


  }

  const handleEditAndView = async (data) => {

    try {
     // await dispatch(getPersonalInformationForm({}));
      await dispatch(setRegistrationNo({ reg_no:data?.reg_no }))
      // await dispatch(setStaffId({ staff_id:2 }))
      navigate(`/dashboard/admission/view-accept`)
      console.log('data is:', data)
    

      

    }
    catch (err) {

    }


  }

  const handlePdf = async (data) => {
  try {
    loadingFun(true)
    const reg_no = data.reg_no;

    // Make POST request to your backend PDF route
    const response = await axios.post(
      `${baseURL}/api/admission/generate-pdf`,
      { reg_no },
      {
        responseType: "blob", // important → tells axios to treat response as binary
      }
    );

    // Create blob from response
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create temporary link to download
    const a = document.createElement("a");
    a.href = url;
    a.download = `admission-${reg_no}.pdf`; // set file name
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Clean up URL
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("PDF download failed:", err);
  }
  finally {
      loadingFun(false); // ✅ reset parent state
    }
};

  




  useEffect(() => {
    if (!tableRef.current) return;

    datatableRef.current = $(tableRef.current).DataTable({
      pageLength: 10,
      processing: true,
      serverSide: true,
      destroy: true,

      ajax: {
        url,
        type: "GET",
        data: (d) => {
          d.filter = {
            className: classFilterRef.current.trim(),
            fromDate: fromDateRef.current.trim(),
            toDate: toDateRef.current.trim(),
            batchId: batchFilterRef.current.trim(),
            divisionId: divisionFilterRef.current.trim(),
            paymentMode: paymentModeFilterRef.current.trim(),
            paymentStatus: paymentStatusFilterRef.current.trim(),
            discountTypeId: discountTypeFilterRef.current.trim(),
          };
        },
      },
      columns,
      createdRow: function (row, data, dataIndex) {

        // Accept button click btn-edit-by-staff
        $(row).find(".btn-accept").on("click", function () {
          handleAccept(data)
        });

        $(row).find(".btn-student").on("click", function () {
          handleEditByStudent(data)
        });

         $(row).find(".btn-staff").on("click", function () {
          handleEditByStaff(data)
        });

         $(row).find(".edit-view").on("click", function () {
          handleEditAndView(data)
        });

          $(row).find(".pdf-view").on("click", function () {
          handlePdf(data)
        });


      },
      headerCallback: function (thead) {
        $(thead).find("th").css("white-space", "nowrap");
      }
    });

    return () => {
      if (datatableRef.current) {
        datatableRef.current.destroy(true);
      }
    };
  }, [url, columns]); // Important: do NOT put filter state here — refs are used for ajax

  return (
    <div className="fee-report-scope d-flex flex-column gap-4 pb-2">
      <section
        className="card fee-report-card border-0 mb-0"
        aria-label="Report filters"
      >
        <div className="card-header border-0 bg-success bg-opacity-10 py-3 px-4">
          <div className="d-flex align-items-center gap-3">
            <span className="fee-report-icon-wrap bg-success text-white shadow-sm">
              <Icon icon="solar:filter-bold-duotone" className="fs-4" />
            </span>
            <div>
              <h6 className="card-title mb-0 fw-semibold text-dark">
                Filter alltransaction payment report
              </h6>
              <p className="small text-muted mb-0 mt-1">
                Narrow results, then apply to refresh the table
              </p>
            </div>
          </div>
        </div>
        <div className="card-body px-4 pb-4 pt-3">
          <div className="row g-3 g-lg-4 align-items-end">
            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                From date
              </label>
              <input
                className="form-control rounded-3"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                To date
              </label>
              <input
                className="form-control rounded-3"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Batch
              </label>
              <select
                className="form-select rounded-3"
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
              >
                <option value="">Select batch</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.academic_year}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Class
              </label>
              <select
                className="form-select rounded-3"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="">Select class</option>
                {classes.map((elem, index) => (
                  <option key={index} value={elem?.id ?? elem?.class_name}>
                    {elem?.class_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Division
              </label>
              <select
                className="form-select rounded-3"
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
              >
                <option value="">Select division</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.division_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Payment mode
              </label>
              <select
                className="form-select rounded-3"
                value={paymentModeFilter}
                onChange={(e) => setPaymentModeFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="online">Online</option>
                <option value="bank">Bank</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Payment status
              </label>
              <select
                className="form-select rounded-3"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partial</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Discount type
              </label>
              <select
                className="form-select rounded-3"
                value={discountTypeFilter}
                onChange={(e) => setDiscountTypeFilter(e.target.value)}
              >
                <option value="">All</option>
                {discountTypes.map((dt) => {
                  const id = dt?.id ?? dt?.discount_type_id;
                  const label =
                    dt?.name ??
                    dt?.discount_type_name ??
                    dt?.title ??
                    (id != null ? String(id) : "");
                  if (id == null && !label) return null;
                  return (
                    <option key={id ?? label} value={id ?? ""}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-md-6 col-lg-3 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-success rounded-pill px-4 w-100 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={handleFilter}
              >
                <Icon icon="solar:magnifer-bold" className="fs-5" />
                Apply filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="card fee-report-card fee-report-table-card basic-data-table border-0 mb-0"
        aria-label="Fee report data"
      >
        <div className="card-header border-0 bg-dark py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <span className="fee-report-icon-wrap bg-white bg-opacity-10 text-white border border-white border-opacity-25">
              <Icon icon="solar:document-text-bold-duotone" className="fs-4" />
            </span>
            <div className="min-w-0">
              <h6 className="card-title mb-0 fw-semibold text-white text-truncate">
                All transaction fee report
              </h6>
              <p className="small text-white opacity-75 mb-0 mt-1 d-none d-sm-block">
                Server-side grid — exports use current filters
              </p>
            </div>
          </div>
          <div className="fee-report-export-group d-flex flex-wrap align-items-center gap-1">
            <button
              type="button"
              className="btn btn-sm rounded-pill btn-outline-light d-inline-flex align-items-center gap-1 px-3 text-white border-white border-opacity-25"
              disabled={!!exportingFormat}
              onClick={() => handleExportDownload("excel")}
              title="Download Excel"
            >
              {exportingFormat === "excel" ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <Icon icon="vscode-icons:file-type-excel" className="fs-5" />
              )}
              Excel
            </button>
            <button
              type="button"
              className="btn btn-sm rounded-pill btn-outline-light d-inline-flex align-items-center gap-1 px-3 text-white border-white border-opacity-25"
              disabled={!!exportingFormat}
              onClick={() => handleExportDownload("csv")}
              title="Download CSV"
            >
              {exportingFormat === "csv" ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <Icon icon="vscode-icons:file-type-csv" className="fs-5" />
              )}
              CSV
            </button>
            <button
              type="button"
              className="btn btn-sm rounded-pill btn-outline-light d-inline-flex align-items-center gap-1 px-3 text-white border-white border-opacity-25"
              disabled={!!exportingFormat}
              onClick={() => handleExportDownload("pdf")}
              title="Download PDF"
            >
              {exportingFormat === "pdf" ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <Icon icon="vscode-icons:file-type-pdf2" className="fs-5" />
              )}
              PDF
            </button>
          </div>
        </div>
        <div className="card-body px-3 px-md-4 pb-4">
          <div
            className="table-responsive shadow-sm rounded-3 border"
            style={{ overflowY: "hidden", overflowX: "auto" }}
          >
            <table
              className="table bordered-table mb-0"
              id="dataTable"
              ref={tableRef}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcadmicAllTransactionReportDataTable
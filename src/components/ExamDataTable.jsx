import { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../assets/css/academicOfflineFeeReport.css";
import "../assets/css/editdelete.css";
import "../assets/css/examination.css";
import DocumentViewer from "./child/DocumentViewer";
import baseURL from "../utils/baseUrl";

const buildFileUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${baseURL}${path}`;
};

const ExamDataTable = ({
  url,
  columns,
  title = "Default Data Tables",
  pageName,
  onEdit,
  onDelete,
  onAssignClass,
  embedded = false,
  onAddMarks,
}) => {
  const [viewUrl, setViewUrl] = useState(null);
  const tableRef = useRef(null);
  const datatableRef = useRef(null);
  const callbacksRef = useRef({ onEdit, onDelete, onAssignClass, onAddMarks });

  const [exam, setExam] = useState([]);
  const [examSchemes, setExamSchemes] = useState([]);
  const [classdivisionmap, setClassDivisionMap] = useState([]);
  const [classlist, setClassList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);

  const [examFilter, setExamFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [termFilter, setTermFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");

  // Refs to hold current filter values for DataTable ajax
  const examFilterRef = useRef("");
  const classFilterRef = useRef("");
  const termFilterRef = useRef("");
  const divisionFilterRef = useRef("");

  useEffect(() => {
    examFilterRef.current = examFilter;
  }, [examFilter]);

  useEffect(() => {
    classFilterRef.current = classFilter;
  }, [classFilter]);

  useEffect(() => {
    termFilterRef.current = termFilter;
  }, [termFilter]);

  useEffect(() => {
    divisionFilterRef.current = divisionFilter;
  }, [divisionFilter]);

  useEffect(() => {
    callbacksRef.current = { onEdit, onDelete, onAssignClass, onAddMarks };
  }, [onEdit, onDelete, onAssignClass, onAddMarks]);

  useEffect(() => {
    Promise.allSettled([
      axios.get(`${baseURL}/api/exam-names`),
      axios.get(`${baseURL}/api/class-div-map-masters`),
    ]).then(([examResponse, classDivisionResponse]) => {
      setExam(examResponse.value?.data?.data || []);
      setClassDivisionMap(classDivisionResponse.value?.data?.data || []);
    });
  }, []);

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setExamFilter(examId);
    setClassFilter("");
    setTermFilter("");
    setDivisionFilter("");
    setClassList([]);
    setTermList([]);
    setDivisionList([]);

    if (!examId) return;

    try {
      const { data } = await axios.get(`${baseURL}/api/exam-schemes/exam-name/${examId}`);
      setExamSchemes(data?.data || []);
      const filterClass = (data?.data || []).map((item) => ({
        id: item.classInfo?.id,
        class_name: item.classInfo?.class_name,
      }));
      setClassList([...new Map(filterClass.map((item) => [item.id, item])).values()]);
    } catch (err) {
      console.error("Failed to load exam schemes", err);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setClassFilter(classId);
    setTermFilter("");
    setDivisionFilter("");

    if (!classId) {
      setTermList([]);
      setDivisionList([]);
      return;
    }

    const filterTerms = examSchemes.filter((item) => item.classInfo?.id == classId);
    setTermList(filterTerms.map((item) => ({ id: item.termInfo?.id, term_name: item.termInfo?.term_name })));

    const division = classdivisionmap.filter((item) => item.classInfo?.id == classId);
    setDivisionList(
      division.map((item) => ({ id: item.divisionInfo?.id, division_name: item.divisionInfo?.division_name }))
    );
  };

  const handleFilter = () => {
    if (datatableRef.current) {
      datatableRef.current.draw();
    }
  };

  useEffect(() => {
    if (!tableRef.current) return;

    const $table = $(tableRef.current);

    datatableRef.current = $table.DataTable({
      pageLength: 10,
      processing: true,
      serverSide: true,
      destroy: true,
      ajax: {
        url,
        type: "GET",
        data: (d) => {
          d.filter = {
            examId: examFilterRef.current.trim(),
            classId: classFilterRef.current.trim(),
            termId: termFilterRef.current.trim(),
            divisionId: divisionFilterRef.current.trim(),
          };
        },
      },
      columns,
    });

    // Namespaced so stale handlers (e.g. after hot reload) never stack up
    $table.off(".examTable");

    $table.on("click.examTable", ".table-action-view-document", function () {
      const documentUrl = $(this).attr("data-id");
      if (!documentUrl) return;
      setViewUrl(buildFileUrl(documentUrl));
    });

    $table.on("click.examTable", ".table-action-edit", function () {
      const id = $(this).data("id");
      const rowData = datatableRef.current?.row($(this).closest("tr")).data();
      callbacksRef.current.onEdit?.(id, rowData);
    });

    $table.on("click.examTable", ".table-action-delete", function () {
      const id = $(this).data("id");
      callbacksRef.current.onDelete?.(id, datatableRef.current);
    });

    $table.on("click.examTable", ".table-action-assign-class", function () {
      const id = $(this).data("id");
      callbacksRef.current.onAssignClass?.(id, datatableRef.current);
    });

    $table.on("click.examTable", ".table-action-add-marks", function () {
      const id = $(this).data("id");
      const rowData = datatableRef.current?.row($(this).closest("tr")).data();
      callbacksRef.current.onAddMarks?.(id, rowData);
    });

    return () => {
      $table.off(".examTable");
      if (datatableRef.current) {
        // Keep the <table> node so React can remount cleanly next time
        datatableRef.current.destroy();
        datatableRef.current = null;
      }
    };
  }, [url, columns]); // Important: do NOT put filter state here — refs are used for ajax

  const content = (
    <>
      <div className="report-filter-grid exam-filter-row">
        <div className="report-filter-field">
          <label className="form-label">
            <span className="label-dot" />
            Exam
          </label>
          <div className="icon-field">
            <span className="icon">
              <Icon icon="solar:document-text-bold-duotone" width="18" />
            </span>
            <select className="form-select" value={examFilter} onChange={handleExamChange}>
              <option value="">Select Exam</option>
              {exam.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.exam_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="report-filter-field">
          <label className="form-label">
            <span className="label-dot" />
            Class
          </label>
          <div className="icon-field">
            <span className="icon">
              <Icon icon="solar:square-academic-cap-bold-duotone" width="18" />
            </span>
            <select className="form-select" value={classFilter} onChange={handleClassChange}>
              <option value="">Select Class</option>
              {classlist.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="report-filter-field">
          <label className="form-label">
            <span className="label-dot" />
            Term
          </label>
          <div className="icon-field">
            <span className="icon">
              <Icon icon="solar:calendar-bold-duotone" width="18" />
            </span>
            <select className="form-select" value={termFilter} onChange={(e) => setTermFilter(e.target.value)}>
              <option value="">Select Term</option>
              {termList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.term_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="report-filter-field">
          <label className="form-label">
            <span className="label-dot" />
            Division
          </label>
          <div className="icon-field">
            <span className="icon">
              <Icon icon="solar:widget-bold-duotone" width="18" />
            </span>
            <select
              className="form-select"
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
            >
              <option value="">Select Division</option>
              {divisionList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.division_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="report-filter-field report-filter-action">
          <button type="button" className="btn-submit chfi-root" onClick={handleFilter}>
            <Icon icon="solar:magnifer-bold-duotone" width="18" />
            Apply Filters
          </button>
        </div>
      </div>

      <div className="report-table-wrap">
        <table
          className="table report-table mb-0"
          ref={tableRef}
          style={{ width: "100%" }}
        />
      </div>
      <DocumentViewer
        url={viewUrl}
        show={!!viewUrl}
        onClose={() => setViewUrl(null)}
      />
    </>
  );

  if (embedded) {
    return <div className="report-table-card mt-4">{content}</div>;
  }

  return (
    <div className="chfi-wrapper pb-2">
      <section className="chfi-card report-table-card" aria-label="Data table">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:document-text-bold-duotone" width="22" />
            </span>
            <div>
              <h5 className="card-title">{pageName || title}</h5>
            </div>
          </div>
        </div>
        <div className="card-body">{content}</div>
      </section>
    </div>
  );
};

export default ExamDataTable;


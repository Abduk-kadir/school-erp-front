import React, { useEffect, useMemo, useState } from "react";
import DepartmentAndDesignation from "../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

const SubRoutePage = () => {
  const [routes, setRoutes] = useState([]);
  const [initialValues, setInitialValues] = useState({
    route_id: "",
    sub_route_name: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/routes`);
        const routeList = res.data?.data || res.data || [];
        setRoutes(Array.isArray(routeList) ? routeList : []);
      } catch (error) {
        setErrorMsg("Failed to load route list. Please try again later.");
      }
    };

    fetchRoutes();
  }, []);

  const initialFields = useMemo(
    () => [
      {
        name: "route_id",
        label: "Route",
        type: "select",
        required: true,
        icon: "solar:map-point-route-bold-duotone",
        options: routes.map((route) => ({
          value: String(route.id),
          label: route.route_name,
        })),
      },
      {
        name: "sub_route_name",
        label: "Sub Route Name",
        type: "text",
        required: true,
        placeholder: "Enter sub-route name",
        icon: "solar:signpost-bold-duotone",
      },
    ],
    [routes]
  );

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/subroutes`, values);
      setSuccessMsg("Sub-route added successfully!");
      setInitialValues({ route_id: "", sub_route_name: "" });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({ route_id: "", sub_route_name: "" });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/subroutes/${id}`);
      alert("Sub-route is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit sub-route:", id);
  };

  return (
    <div>
      <DepartmentAndDesignation
        initialFields={initialFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonText="Save"
        resetButtonText="Reset"
        handleReset={handleReset}
        successMsg={successMsg}
        errorMsg={errorMsg}
        setSuccessMsg={setSuccessMsg}
        setErrorMsg={setErrorMsg}
        cardTitle="Sub Route"
        cardIcon="solar:signpost-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Sub Routes"
        url={`${baseURL}/api/subroutes`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "sub_route_name", title: "Sub Route Name" },
          { data: "Route.route_name", title: "Route Name" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Sub Route">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Sub Route">Delete</button>
                </div>
              `;
            },
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SubRoutePage;

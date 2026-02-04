import React from "react";

const DeclarationStage = () => {
  return (
    <div className="card p-3 d-flex">

      {/* First Row - centered */}
      <div className="d-flex  mb-3">
        <div className="d-flex gap-3" style={{ maxWidth: "60%" }}>
          <div>
            <label className="form-label fw-bold">Regestration Id</label>
            <input type="text" className="form-control mb-2" placeholder="Username" />
          </div>
          <div>
            <label className="form-label fw-bold">Form No</label>
            <input type="text" className="form-control mb-2" placeholder="Username" />
          </div>
          <div>
            <label className="form-label fw-bold">Standard Studing In</label>
            <input type="text" className="form-control mb-2" placeholder="Username" />
          </div>
        </div>
      </div>

      {/* Second Row - centered row, text left-aligned */}
      <div className="d-flex ">
        <div style={{ maxWidth: "60%" }}>
          <p className="text-start">
            fjdhfjkdhfjdhfjkdhfjkdhfkjdshfjkdfkjdhfkjdshfjkdhfjksdhfjkdhfkjh
          </p>
        </div>
      </div>

    </div>
  );
};

export default DeclarationStage;

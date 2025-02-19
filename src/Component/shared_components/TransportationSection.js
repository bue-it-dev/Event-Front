import React from "react";

const TransportationInfo = ({ transportations, setTransportations }) => {
  const handleFieldChange = (index, field, value) => {
    const updated = transportations.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setTransportations(updated);
  };

  const handleDelete = (index) => {
    const updated = transportations.filter((_, i) => i !== index);
    setTransportations(updated);
  };

  return (
    <div>
      {transportations.map((transport, index) => (
        <div key={index} className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Type</label>
            <input
              type="text"
              className="form-control"
              value={transport.TransportationTypeId || ""}
              onChange={(e) =>
                handleFieldChange(index, "TransportationTypeId", e.target.value)
              }
              placeholder="Type"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={transport.StartDate || ""}
              onChange={(e) =>
                handleFieldChange(index, "StartDate", e.target.value)
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={transport.EndDate || ""}
              onChange={(e) =>
                handleFieldChange(index, "EndDate", e.target.value)
              }
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              value={transport.Quantity || ""}
              onChange={(e) =>
                handleFieldChange(index, "Quantity", e.target.value)
              }
              placeholder="Qty"
            />
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <button type="button" className="btn btn-danger" onClick={() => handleDelete(index)}>
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransportationInfo;

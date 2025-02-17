import React from "react";

const PassportInfoSection = ({ eventData, seteventData}) => {
  return (
    <div className="container">
      <div className="row">
        {/* Passport Name */}
        <div className="col-md-6 mb-4">
          <label htmlFor="EventTitle" className="form-label fs-6 ">
          EventTitle
          </label>
          <input
            type="text"
            id="EventTitle"
            name="EventTitle"
            value={eventData.EventTitle}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only letters and spaces, but not only spaces
              if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                seteventData({
                  ...eventData,
                  EventTitle: value,
                });
              } else if (value === "") {
                // Allow clearing the input
                seteventData({
                  ...eventData,
                  EventTitle: value,
                });
              }
            }}
            className="form-control form-control-lg"
            required
            pattern="[a-zA-Z ]+"
          />
        </div>
       
        </div>
      </div>
  );
};

export default PassportInfoSection;

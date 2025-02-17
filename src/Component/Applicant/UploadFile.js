import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
const UploadFile = (props) => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [test, setTest] = useState();
  const savefile = async (e) => {
    //console.log("helllllllllllllll",e.target.files[0]);
    setFile(e.target.files[0]);
    setFileName(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    //e.preventDefault();
    //console.log("jjj",file);
    let formData = new FormData();
    formData.append("formFile", file);
    formData.append("fileName", fileName);
    setTest(formData);
    e.preventDefault();
    props.setRequestRefund({
      ...props.addRequestRefund,
      nationalNumber: formData,
    });
    //console.log("formdata", formData)
    //console.log("Aa", props.addRequestRefund)
    try {
      const response = await axios.put(
        `${URL.BASE_URL}/api/ApplicantCourse/ApplicantRequestRefund?applicantCourseId=${props.addRequestRefund.id}`,
        props.addRequestRefund,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "multipart/form-data",
          },
        }
      );
      if (response && response.status === 200) {
        //console.log("file upload success", response);
      } else {
        //console.log("file upload erroe", response);
      }
      //console.log(response);
      return response;
    } catch (ex) {
      //console.log(ex);
    }
  };

  return (
    <>
      {/* <form onSubmit={uploadFile}> */}
      <input type="file" onChange={savefile} />
      <input type="button" value="upload" onClick={uploadFile} />
      {/* </form> */}
    </>
  );
};

export default UploadFile;

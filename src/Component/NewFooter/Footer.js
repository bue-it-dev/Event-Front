import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function App() {
  return (
    <MDBFooter className="bg-dark text-center text-white mt-4">
      <MDBContainer className="p-4 pb-0">
        <section className="mb-4">
          <img
            style={{ marginRight: "70px" }}
            class="alignnone size-full wp-image-42667"
            src="https://old.bue.edu.eg/wp-content/uploads/2022/03/BUE-logo2-03.png"
            alt=""
            width="15%"
            height="6%"
          />
          <a
            className="btn btn-outline-light btn-floating m-1"
            href="https://www.facebook.com/thebritishuniversityegypt"
            role="button"
            target="_blank"
          >
            <MDBIcon fab icon="facebook-f" />
          </a>

          <a
            className="btn btn-outline-light btn-floating m-1"
            href="https://twitter.com/bue_official"
            role="button"
            target="_blank"
          >
            <MDBIcon fab icon="twitter" />
          </a>
          <a
            className="btn btn-outline-light btn-floating m-1"
            href="https://www.instagram.com/thebritishuniversityinegypt/"
            role="button"
            target="_blank"
          >
            <MDBIcon fab icon="instagram" />
          </a>
          <a
            className="btn btn-outline-light btn-floating m-1"
            href="https://www.linkedin.com/school/the-british-university-in-egypt/"
            role="button"
            target="_blank"
          >
            <MDBIcon fab icon="linkedin-in" />
          </a>
        </section>
      </MDBContainer>

      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        Copyright © 2025 <strong>The British University in Egypt</strong>, All
        rights reserved.
      </div>
    </MDBFooter>
  );
}

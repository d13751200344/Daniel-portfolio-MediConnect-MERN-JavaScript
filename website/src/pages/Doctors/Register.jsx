import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import Form from "./Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./Doctors.module.css";

const Register = () => {
  /* useState, and we use State lifting to bring this from Form.jsx to here */
  const [doctor, setDoctor] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  // the function at the first argument will be called when the component is mounted (once)
  useEffect(() => {
    const fetchData = async () => {

      const hospitalResponse = await axios.get("/api/hospitals");

      setHospitals(hospitalResponse.data);
    };

    fetchData();
  }, []);

  const submitForm = async (event) => {
    /* prevent the form from submitting itself, because we want to bind a function to the 
	  submit event */
    event.preventDefault();

    try {
      /* /WEBSITE/app.js > apiRoutes.js > facade/DoctorsController.js > 
      facade/services/DoctorService.js (create) > /SERVER/routes/APIRoutes.js (
        use axios to run 
        router.post("/doctors", applicationAuthenticate, upload.single("avatar"), doctorCreate); 
        )
        */
      await axios.post("/api/doctors", doctor);
      toast("Doctor registered successfully");
      navigate("/doctors");
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || "An error occurred");
    }
  };

  // use props & state lifting to pass doctor and setDoctor to Form.jsx
  return (
    <div className="container mt-5">
      <PageTitle title="Register" />
      <h1>Register</h1>
      <hr className="my-3" />

      <Form
        doctor={doctor}
        setDoctor={setDoctor}
        hospitals={hospitals}
        submitForm={submitForm}
        submitLabel="Register"
      />

      <div className="mt-4">
        <a className={styles.backButton} href="/doctors">
          Back to doctor list
        </a>
      </div>
    </div>
  );
};

export default Register;

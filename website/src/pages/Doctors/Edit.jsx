import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Form from "./Form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState({});
  const [hospitals, setHospitals] = useState([]);

  /* every time the [id] changes, fetchData() will be triggered  */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          // Handle the case when id is not available
          return;
        }
        const doctorResponse = await axios.get(`/api/doctors/${id}`);
        const hospitalResponse = await axios.get("/api/hospitals");

        setDoctor(doctorResponse.data);
        setHospitals(hospitalResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const submitForm = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`/api/doctors/${id}`, doctor);
      toast("Doctor updated successfully");
      navigate(`/doctors/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || "An error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <PageTitle title="Edit Doctor" />
      <h1>Edit Doctor Detail</h1>

      <hr className="my-3" />

      <Form
        doctor={doctor}
        setDoctor={setDoctor}
        submitForm={submitForm}
        submitLabel="Update"
        hospitals={hospitals}
      />
    </div>
  );
};

export default Edit;

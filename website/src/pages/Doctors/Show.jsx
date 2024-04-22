import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; /* useParams is a hook, it returns an object of key/value 
pairs of URL parameters, allows functional components to access parameters from the current URL */
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import { useAuth } from "../../App";
import styles from "./Doctors.module.css";

const Show = () => {
  const { id } = useParams(); // a hook that allows us to access the URL parameters
  const [doctor, setDoctor] = useState({}); // useState: doctor initialized as an empty object
  const [hospitals, setHospitals] = useState([]); // useState: hospitals initialized as an empty array
  const { user } = useAuth(); // Access the user object from the useAuth context

  /* every time the [id] changes, fetchData() will be triggered  */
  useEffect(() => {
    const fetchData = async () => {
      const doctorResponse = await axios.get(`/api/doctors/${id}`);
      const hospitalResponse = await axios.get("/api/hospitals");

      setDoctor(doctorResponse.data);
      setHospitals(hospitalResponse.data);
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mt-5">
      <PageTitle title="Doctor" />
      <h1>Doctor</h1>
      <hr className="my-3" />

      <table className="table table-striped table-bordered my-4">
        <thead>
          <tr>
            <th className={`text-center ${styles.tableHeader}`}>Doctor Name</th>
            <th className={`text-center ${styles.tableHeader}`}> Medical Specialty</th>
            <th className={`text-center ${styles.tableHeader}`}>Hospital</th>
            {user && user.id && <th className={`text-center ${styles.tableHeader}`}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {doctor && doctor._id && (
            <tr key={doctor._id}>
              <td className={`text-center ${styles.tableBody}`}>{doctor.doctorName}</td>
              <td className={`text-center ${styles.tableBody}`}>{doctor.medicalSpecialty}</td>
              <td className={`text-center ${styles.tableBody}`}>
                <a href={`/hospitals/${doctor.hospital}`}>
                  {doctor.hospital &&
                    hospitals.find((h) => h._id === doctor.hospital)
                      ?.hospitalName}
                </a>
              </td>
              {user && user.id && (
                <td className='text-center'>
                  <a href={`/doctors/${doctor._id}/edit`} className="btn btn-sm btn-warning mb-2">Edit</a>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>

      <a className={styles.backButton} href="/doctors">
        Back to doctor list
      </a>
    </div>
  );
};

export default Show;

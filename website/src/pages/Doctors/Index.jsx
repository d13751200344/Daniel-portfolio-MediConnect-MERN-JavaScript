import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import { Link } from "react-router-dom"; /* allow us to be able to create anchors that point to the doctor itself */
import { useAuth } from "../../App";
import styles from "./Doctors.module.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const { user } = useAuth(); // Access the user object from the useAuth context

  // the function at the first argument will be called when the component is mounted (once)
  useEffect(() => {
    const fetchData = async () => {
      const doctorResponse = await axios.get("/api/doctors");

      const hospitalResponse = await axios.get("/api/hospitals");

      setDoctors(doctorResponse.data);
      setHospitals(hospitalResponse.data);
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <PageTitle title="Doctors" />
      <h1>Doctors</h1>
      <hr className="my-3" />

      {user && user.id && (
        <a href="/doctors/new" className={`${styles.registerButton}`}>
          Register Doctor
        </a>
      )}
      <table className="table table-striped table-bordered mt-4">
        <thead>
          <tr>
            <th className={`text-center ${styles.tableHeader}`}>Doctor Name</th>
            <th className={`text-center ${styles.tableHeader}`}>Medical Specialty</th>
            <th className={`text-center ${styles.tableHeader}`}>Hospital</th>
            <th className={`text-center ${styles.tableHeader}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors &&
            doctors.length > 0 &&
            doctors.map(({ _id, doctorName, medicalSpecialty, hospital }) => (
              <tr key={_id}>
                <td className={`text-center ${styles.tableBody}`}>{doctorName}</td>
                <td className={`text-center ${styles.tableBody}`}>{medicalSpecialty}</td>
                <td className={`text-center ${styles.tableBody}`}>
                  <a href={`/hospitals/${hospital}`}>
                    {hospital &&
                      hospitals.find((h) => h._id === hospital)?.hospitalName}
                  </a>
                </td>
                <td className="text-center">
                  <Link to={`/doctors/${_id}`} className="btn btn-sm btn-success mb-2">View</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Doctors;

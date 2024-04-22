import React, { useEffect, useState } from "react";
import styles from "./Hospitals.module.css";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import { Link } from "react-router-dom"; /* allow us to be able to create anchors that point to the hospital itself */
import Hospital from "./Hospital";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);

  // the function at the first argument will be called when the component is mounted (once)
  useEffect(() => {
    const fetchData = async () => {
      const hospitalResponse = await axios.get("/api/hospitals");

      setHospitals(hospitalResponse.data);
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <PageTitle title="Hospitals" />
      <h1>Hospitals</h1>
      <hr className="my-3" />

      <table className="table table-striped table-bordered mt-4">
        <thead>
          <tr>
            <th className={`text-center ${styles.tableHeader}`}>Hospital Name</th>
            <th className={`text-center ${styles.tableHeader}`}>Location</th>
            <th className={`text-center ${styles.tableHeader}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals &&
            hospitals.length > 0 &&
            hospitals.map(({ _id, hospitalName, location }) => (
              <tr key={_id}>
                <td className={`text-center ${styles.tableBody}`}>{hospitalName}</td>
                <td className={`${styles.tableBody}`}>{location}</td>
                <td className="text-center">
                  <Link to={`/hospitals/${_id}`} className="btn btn-sm btn-success mb-2">View</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Hospitals;

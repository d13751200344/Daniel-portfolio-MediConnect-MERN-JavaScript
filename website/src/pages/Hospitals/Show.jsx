/* useEffect is a hook, it allows functional components to use lifecycle methods; useState is a hook, 
it allows functional components to use state */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; /* useParams is a hook, it returns an object of key/value 
pairs of URL parameters, allows functional components to access parameters from the current URL */
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import Hospital from "./Hospital";
import styles from "./Hospitals.module.css";

const Show = () => {
  const { id } = useParams(); // a hook that allows us to access the URL parameters
  const [hospital, setHospital] = useState({}); // useState: hospital initialized as an empty object

  /* every time the [id] changes, fetchData() will be triggered  */
  useEffect(() => {
    const fetchData = async () => {
      const hospitalResponse = await axios.get(`/api/hospitals/${id}`);

      setHospital(hospitalResponse.data);
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mt-5">
      <PageTitle title="Hospital" />
      <h1>Hospital</h1>
      <hr className="my-3" />

      <table className="table table-striped table-bordered my-4">
        <thead>
          <tr>
            <th className={`text-center ${styles.tableHeader}`}>Hospital Name</th>
            <th className={`text-center ${styles.tableHeader}`}>Location</th>
            <th className={`text-center ${styles.tableHeader}`}>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {hospital && hospital._id && (
            <tr key={hospital._id}>
              <td className={`text-center ${styles.tableBody}`}>{hospital.hospitalName}</td>
              <td className={`${styles.tableBody}`}>{hospital.location}</td>
              <td className={`text-center ${styles.tableBody}`}>{hospital.updatedAt}</td>
            </tr>
          )}
        </tbody>
      </table>

      <a className={styles.backButton} href="/hospitals">
        Back to hospital list
      </a>
    </div>
  );
};

export default Show;

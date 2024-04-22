import React from "react";
import styles from "./Hospitals.module.css";

// children is prop
const Hospital = ({ hospital, children }) => {
  return (
    // key attribute is for iterating in Index.jsx file (so we won't have errors)
    <div key={hospital._id} className={`${styles.hospital}`}>
      <div className={styles.hospitalBody}>
        <h5 className={styles.hospitalTitle}>{hospital.hospitalName}</h5>
        <p>Location: {hospital.location}</p>
      </div>

      {children}
    </div>
  );
};

export default Hospital;

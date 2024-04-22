import React from "react";
import styles from "./Doctors.module.css";

/* use prop to pass doctor to here, and setDoctor to update the doctor object (useState)
- We use State lifting, put `const [doctor, setDoctor] = ...` in upper layer file and pass 
parameters here */
const Form = ({ doctor, setDoctor, submitForm, submitLabel, hospitals }) => {
  const onChange = (event) => {
    /* get doctor object and only update the value of the key that is being changed, and 
        keep the rest of the object the same (...is the spread operator) */
    setDoctor({ ...doctor, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={submitForm}>
      <div className="form-group my-3">
        <label htmlFor="doctorName" className={`${styles.formLabel}`}>Doctor Name</label>
        <input
          type="text"
          className="form-control"
          id="doctorName"
          name="doctorName"
          onChange={onChange}
          value={doctor?.doctorName}
        />
      </div>
      <div className="form-group my-3">
        <label htmlFor="medicalSpecialty" className={`${styles.formLabel}`}>Medical Specialty</label>
        <input
          type="text"
          className="form-control"
          id="medicalSpecialty"
          name="medicalSpecialty"
          onChange={onChange}
          value={doctor?.medicalSpecialty}
        />
      </div>

      <div className="form-group my-3">
        <label htmlFor="hospital" className={`${styles.formLabel}`}>Hospital</label>

        <select
          id="hospital"
          name="hospital"
          className="form-select"
          required
          onChange={onChange}
          value={doctor?.hospital}
        >
          <option disabled selected>
            Please select the hospital where you work:
          </option>
          {hospitals.map((hosp) => (
            <option key={hosp._id} value={hosp._id}>
              {hosp.hospitalName}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
};

export default Form;

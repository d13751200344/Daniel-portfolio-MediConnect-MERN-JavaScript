import React from "react";
import styles from "./Users.module.css";

/* use prop to pass user to here, and setUser to update the user object (useState)
- We use State lifting, put `const [user, setUser] = ...` in upper layer file and pass 
parameters here */
const Form = ({ user, setUser, submitForm, submitLabel }) => {
  const onChange = (event) => {
    /* get user object and only update the value of the key that is being changed, and 
        keep the rest of the object the same (...is the spread operator) */
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={submitForm}>
      <div className="form-group my-3">
        <label htmlFor="minc" className={`${styles.formLabel}`}>Medical Identification Number for Canada</label>
        <input
          type="text"
          className="form-control"
          id="minc"
          name="minc"s
          onChange={onChange}
          value={user?.minc}
        />
      </div>
      <div className="form-group my-3">
        <label htmlFor="firstName" className={`${styles.formLabel}`}>First Name</label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          name="firstName"
          onChange={onChange}
          value={user?.firstName}
        />
      </div>

      <div className="form-group my-3">
        <label htmlFor="lastName" className={`${styles.formLabel}`}>Last Name</label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          name="lastName"
          onChange={onChange}
          value={user?.lastName}
        />
      </div>

      <div className="form-group my-3">
        <label htmlFor="email" className={`${styles.formLabel}`}>Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          onChange={onChange}
          value={user?.email}
        />
      </div>

      <div className="form-group my-3">
        <label htmlFor="nickname" className={`${styles.formLabel}`}>Nickname</label>
        <input
          type="text"
          className="form-control"
          id="nickname"
          name="nickname"
          onChange={onChange}
          value={user?.nickname}
        />
      </div>

      <div className="form-group my-3">
        <label htmlFor="password" className={`${styles.formLabel}`}>Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          onChange={onChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
};

export default Form;

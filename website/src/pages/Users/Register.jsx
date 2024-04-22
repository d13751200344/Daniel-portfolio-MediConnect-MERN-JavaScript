import React, { useState } from "react";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import Form from "./Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  /* useState, and we use State lifting to bring this from Form.jsx to here */
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const submitForm = async (event) => {
    /* prevent the form from submitting itself, because we want to bind a function to the 
	  submit event */
    event.preventDefault();

    try {
      /* /WEBSITE/app.js > apiRoutes.js > facade/UsersController.js > 
      facade/services/UserService.js (create) > /SERVER/routes/APIRoutes.js (
        use axios to run 
        router.post("/users", applicationAuthenticate, upload.single("avatar"), userCreate); 
        )
        */
      await axios.post("/api/users", user);
      toast("User registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || "An error occurred");
    }
  };

  // use props & state lifting to pass user and setUser to Form.jsx
  return (
    <div className="container mt-5">
      <PageTitle title="Register" />
      <h1>Register</h1>
      <hr className="my-3" />

      <Form
        user={user}
        setUser={setUser}
        submitForm={submitForm}
        submitLabel="Register"
      />
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App"; // import Context
import styles from "./Users.module.css";

const Login = () => {
  // ask axios to carry credentials (cookies/session headers) with every request
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  /* useState, and we use State lifting to bring this from Form.jsx to here */
  const [user, setUser] = useState({});

  // get the setUser from userAuth context obj, and rename it because we already have setUser
  const { setUser: login } = useAuth();

  const submitForm = async (event) => {
    /* prevent the form from submitting itself, because we want to bind a function to the 
	  submit event */
    event.preventDefault();

    try {
      /* /WEBSITE/app.js > apiRoutes.js > facade/UsersController.js > 
		facade/services/UserService.js (create) > /SERVER/routes/APIRoutes.js (use axios to run 
		router.post("/users/authenticate", applicationAuthenticate, userAuthenticate);  )*/
      const resp = await axios.post("/api/users/authenticate", user);
      // the "user" here is from the form ( setUser({...}) ) below
      // if everything is fine, we will get the user data from the response ("/server/controllers/AuthenticateController.js")

      //setUser(resp.data);
      login(resp.data); // equal to `setUser(resp.data)` which is retrieved from useAuth
      Cookies.set("user", JSON.stringify(resp.data)); // save user in cookie

      toast("User logged in successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || "An error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <PageTitle title="Login" />
          <h1>Login</h1>
          <hr className="my-3" />

          <div className="card">
            <div className="card-body">
            <form onSubmit={submitForm}>
              <div className="form-group my-3">
                <label htmlFor="email" className={`${styles.formLabel}`}>Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                {/* get user object and only update the value of the key that is being changed, and 
                keep the rest of the object the same (...is the spread operator) */}
              </div>

              <div className="form-group my-3">
                <label htmlFor="password" className={`${styles.formLabel}`}>Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                {/* get user object and only update the value of the key that is being changed, and 
                keep the rest of the object the same (...is the spread operator) */}
              </div>

              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

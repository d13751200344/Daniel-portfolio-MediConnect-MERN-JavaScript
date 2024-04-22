import React, {
  Suspense,
  lazy,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";

import Navigation from "./components/Navigation";
import Home from "./pages/Home";

// Create a context for the authentication
const AuthContext = createContext(null);
// useAuth is the context obj that stores the data and enables us to set & access the value
export const useAuth = () => useContext(AuthContext);
/* and we can use this context in any component by importing useAuth. See below, We get user's cookie to set user's data, and utilize <AuthContext.Provider value={{ user, setUser }}> to make the context available to all children components. */

// Lazy load the components
const HospitalIndex = lazy(() => import("./pages/Hospitals/Index"));
const HospitalShow = lazy(() => import("./pages/Hospitals/Show"));
const DoctorIndex = lazy(() => import("./pages/Doctors/Index"));
const DoctorShow = lazy(() => import("./pages/Doctors/Show"));
const DoctorRegister = lazy(() => import("./pages/Doctors/Register"));
const DoctorEdit = lazy(() => import("./pages/Doctors/Edit"));
const Register = lazy(() => import("./pages/Users/Register"));
const Login = lazy(() => import("./pages/Users/Login"));
const Logout = lazy(() => import("./pages/Users/Logout"));
const Profile = lazy(() => import("./pages/Users/Profile"));

const App = () => {
  /* to check if the user is logged in when the page is rendered, as the profile will only 
  be returned only for the logged-in user. */
  const [user, setUser] = useState(null); // Set the user state to null

  useEffect(() => {
    let user = Cookies.get("user"); // Get the user from the cookie

    if (!user) return; // If no user, stop working here

    user = JSON.parse(user); // Parse the user from JSON

    const fetchData = async () => {
      try {
        // get the user data from userShow
        const userResp = await axios.get(`/api/users/${user.id}`);
        // if everything is fine, set the user with the response data
        setUser(userResp.data);
      } catch (error) {
        // if there is an error, remove the user from the cookie
        Cookies.remove("user");
        setUser(null);
        return;
      }
    };

    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <ToastContainer />
        <Navigation />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hospitals" element={<HospitalIndex />} />
            <Route path="/hospitals/:id" element={<HospitalShow />} />
            <Route path="/doctors" element={<DoctorIndex />} />
            <Route path="/doctors/:id" element={<DoctorShow />} />
            <Route path="/doctors/new" element={<DoctorRegister />} />
            <Route path="/doctors/:id/edit" element={<DoctorEdit />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

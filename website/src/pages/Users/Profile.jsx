import React from "react";
import PageTitle from "../../components/PageTitle";
import Form from "./Form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App"; // import Context

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  if (!user) {
    return navigate("/login");
  }

  const submitForm = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`/api/users/${user._id || user.id}`, user);
      toast("User updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || "An error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <PageTitle title="Profile" />
      <h1>Profile</h1>
      {user.firstName ? (
        <h2>{`Hello, ${user.firstName} ${user.lastName}!`}</h2>
      ) : null}

      <hr className="my-3" />

      <Form
        user={user}
        setUser={setUser}
        submitForm={submitForm}
        submitLabel="Update"
      />
    </div>
  );
};

export default Profile;

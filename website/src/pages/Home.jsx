import React from "react";
import styles from "./Home.module.css";
import PageTitle from "../components/PageTitle";

// Define the Home component as a functional component
const Home = () => {
  // Return statement contains the JSX layout for the component
  return (
    <div
      className={`${styles.doctorsImage} d-flex align-items-center justify-content-center`}
    >
      <PageTitle title="Home" />
      <div className={`${styles.outStructure}`}>
        <h1
          className={`${styles.shadow} ${styles.title} display-1 text-center`}
        >
          <span className={`${styles.medi}`}>Medi</span>
          <span className={`${styles.connect}`}>Connect</span>
        </h1>
        <div>
          <a
            href="/hospitals"
            className={`${styles.hospitalLink} btn btn-success btn-lg`}
          >
            Browse Hospitals
          </a>
          <a
            href="/doctors"
            className={`${styles.doctorsLink} btn btn-info btn-lg`}
          >
            Browse Doctors
          </a>
        </div>
      </div>
    </div>
  );
};

/* <a href="https://kr.freepik.com/free-photo/group-of-five-laughing-successful-doctors-standing-together_10626366.htm#query=%EC%9D%98%EC%82%AC%EB%93%A4&position=32&from_view=keyword&track=ais&uuid=37ff9aec-cf7b-48e7-be43-6d2cc4b65554"> valuavitaly</a>  Freepik */
/* Export the Home component to be used in other parts of the application */
export default Home;

import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const PageTitle = ({ title }) => {
  // Destructuring the title prop
  //or const PageTitle = (props) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title> {title} | MediConnect </title>
      </Helmet>
    </HelmetProvider>
  );
};

export default PageTitle;

import APIProvider from "../utilities/APIProvider.js";

const DoctorService = (async () => {
  const apiProvider = await APIProvider(); // axios instance

  return {
    index: async () => {
      try {
        const doctors = await apiProvider.get("/doctors");
        /* run router.get("/doctors", applicationAuthenticate, doctorIndex); in 
        SERVER/routes/APIRoutes.js */

        return doctors.data?.doctors || [];
      } catch (error) {
        console.log("error in DoctorService.index", error);
        throw error;
      }
    },

    show: async (id) => {
      try {
        const doctor = await apiProvider.get(`/doctors/${id}`);
        /* run router.get("/doctors/:id", applicationAuthenticate, doctorShow); in 
        SERVER/routes/APIRoutes.js */

        return doctor.data?.doctor || {};
      } catch (error) {
        console.log("error in DoctorService.show", error);
        throw error;
      }
    },
    // we need to fake a form and submit it to the server
    create: async (doctor, cookies) => {
      //doctor is req.body in the controller
      try {
        const formData = new FormData(); // create a new form data

        // doctor table has fields, and we use Object[key, value] to map the fields
        Object.keys(doctor).forEach((key) => {
          // append the doctor data (fields' names & values) to the form data
          formData.append(key, doctor[key]);
        });

        // post the form data to the server (includs path, data, and headers)
        /* use axios to run 
          router.post("/doctors", applicationAuthenticate, upload.single("avatar"), doctorCreate); 
          in SERVER/routes/APIRoutes.js */
        await apiProvider.post("/doctors", formData, {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies,
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    //doctor is req.body, id is req.params.id, and cookies is req.headers.cookie
    update: async (id, doctor, cookies) => {
      //cookies is for authentication
      try {
        // fake a form and submit it to the server, same as create
        const formData = new FormData();

        Object.keys(doctor).forEach((key) => {
          formData.append(key, doctor[key]);
        });

        /* use axios to run
          router.put("/doctors/:id", applicationAuthenticate, isAuthenticated, 
          upload.single("avatar"), doctorUpdate);
          in SERVER/routes/APIRoutes.js */
        await apiProvider.put(`/doctors/${id}`, formData, {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies,
          }, // because we need to authenticate the doctor, we need to send the cookies
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };
})(); // The immediately-invoked function expression (IIFE)

export default DoctorService;

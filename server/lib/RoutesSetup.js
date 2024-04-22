import PageRoutes from "../routes/PageRoutes.js";
import HospitalRoutes from "../routes/HospitalRoutes.js";
import DoctorRoutes from "../routes/DoctorRoutes.js";
import UserRoutes from "../routes/UserRoutes.js";
import AuthenticationRoutes from "../routes/AuthenticationRoutes.js";
import ApplicationRoutes from "../routes/ApplicationRoutes.js";
import APIRoutes from "../routes/APIRoutes.js";

export default (app) => {
  // Registering our PageRoutes as middleware
  app.use("/", PageRoutes); // "/" means it's for "/{...}", "PageRoutes" states the routes file

  // Our Hospital routes
  app.use("/hospitals", HospitalRoutes); // "/hospitals" means it's for "/hospitals/{...}", "HospitalRoutes" states the routes file

  // Our Doctor routes
  app.use("/doctors", DoctorRoutes);

  // Our User routes
  app.use("/users", UserRoutes);

  // Our Authentication routes
  app.use("/", AuthenticationRoutes);

  // Our Application routes, only ADMIN can access this
  app.use("/applications", ApplicationRoutes);

  // Our API routes
  app.use("/api", APIRoutes);
};

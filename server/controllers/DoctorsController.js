import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";

export const index = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({}); //find all doctors
    const hospitals = await Hospital.find({}); //find all hospitals

    //this is a listener for the "Accept" header in the request
    res.format({
      // if "text/html", ..., if "application/json", ...
      "text/html": () => {
        //render the index page
        res.render("doctors/index", {
          doctors, //doctors: doctors, (pass the doctors to the index page)
          title: "Doctors",
          hospitals,
        });
      },
      "application/json": () => {
        res.json({ doctors, hospitals });
      },
      //if the "Accept" header is not "text/html" or "application/json", then:
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    console.log("error in index of DoctorController.");
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      req.status = 404;
      throw new Error("Doctor does not exist");
    }

    // Fetch hospital name from MongoDB
    const hospital = await Hospital.findById(doctor.hospital);
    if (!hospital) {
      req.status = 404;
      throw new Error("Cannot find the hospital.");
    }
    const doctorHospitalName = hospital ? hospital.hospitalName : "Unknown";

    //this is a listener for the "Accept" header in the request
    res.format({
      // if "text/html", ..., if "application/json", ...
      "text/html": () => {
        res.render("doctors/show", {
          doctor,
          doctorHospitalName,
          title: "Doctor View",
        });
      },
      "application/json": () => {
        res.json({ doctor, doctorHospitalName });
      },
      //if the "Accept" header is not "text/html" or "application/json", then:
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    console.log("error in show of DoctorController.");
    next(error);
  }
};

export const add = async (req, res, next) => {
  try {
    // Fetch hospitals from MongoDB
    const hospitals = await Hospital.find({});
    
    if (!hospitals || hospitals.length === 0) {
      req.status = 404;
      throw new Error("You must have at least one hospital in the database.");
    }

    //this is a listener for the "Accept" header in the request
    res.format({
      // if "text/html", ..., if "application/json", ...
      "text/html": () => {
        res.render("doctors/add", {
          //"doctors/add" means "/views/doctors/add.ejs"
          formType: "create",
          title: "New Doctor",
          hospitals,
        });
      },
      "application/json": () => {
        res.json({ hospitals });
      },
      //if the "Accept" header is not "text/html" or "application/json", then:
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    console.log("error in add of DoctorController.");
    next(error);
  }
};

export const edit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Missing required ID");

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      req.status = 404;
      throw new Error("Doctor does not exist");
    }

    // Fetch hospitals from MongoDB
    const hospitals = await Hospital.find({});
    if (!hospitals || hospitals.length === 0) {
      req.status = 404;
      throw new Error("You must have at least one hospital in the database.");
    }

    //this is a listener for the "Accept" header in the request
    res.format({
      // if "text/html", ..., if "application/json", ...
      "text/html": () => {
        res.render("doctors/edit", {
          doctor,
          formType: "update",
          title: "Edit Doctor",
          hospitals,
        });
      },
      "application/json": () => {
        res.json({ doctor, hospitals });
      },
      //if the "Accept" header is not "text/html" or "application/json", then:
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    console.log("error in edit of DoctorController.");
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { doctorName, medicalSpecialty, hospital } = req.body;

    const doctor = new Doctor({ doctorName, medicalSpecialty, hospital });

    await doctor.save();

    res.format({
      "text/html": () => {
        //set notification to session, and this will work with "/app.js" notification setting
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Doctor was created successfully",
          },
        ];
        //redirect to the index page, we don't use "render" because the user may hit refresh and post again
        res.redirect("/doctors");
      },
      "application/json": () => {
        res.status(201).json({ status: 201, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    console.log("error in create of DoctorController.");
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { doctorName, medicalSpecialty, hospital } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    //console.log(doctor);

    if (!doctor) {
      req.status = 404;
      throw new Error("Doctor does not exist");
    }

    doctor.doctorName = doctorName;
    doctor.medicalSpecialty = medicalSpecialty;
    doctor.hospital = hospital;

    await doctor.save();

    res.format({
      "text/html": () => {
        //set notification to session, and this will work with "/app.js" notification setting
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Doctor was updated successfully",
          },
        ];
        //redirect to the index page, we don't use "render" because the user may hit refresh and post again
        res.redirect("/doctors");
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Doctor failed to update" },
    ];
    console.log("error in update of DoctorController.");
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      req.status = 404;
      throw new Error("Doctor does not exist");
    }

    await Doctor.findByIdAndDelete(req.params.id);

    res.format({
      "text/html": () => {
        //set notification to session, and this will work with "/app.js" notification setting
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Doctor was deleted successfully",
          },
        ];
        res.redirect("/doctors");
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Doctor failed to delete" },
    ];
    console.log("error in remove of DoctorController.");
    next(error);
  }
};

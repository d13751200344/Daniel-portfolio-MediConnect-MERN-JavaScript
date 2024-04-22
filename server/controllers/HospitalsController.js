import Hospital from "../models/Hospital.js";

export const index = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find({}); //find all hospitals

    //this is a listener for the "Accept" header in the request
    res.format({
      // if "text/html", ..., if "application/json", ...
      "text/html": () => {
        res.render("hospitals/index", {
          hospitals, //hospitals: hospitals, (pass the hospitals to the index page)
          title: "Hospitals",
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
    console.log("error in index of HospitalController");
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      req.status = 404;
      throw new Error("Hospital does not exist");
    }

    //this is a listener for the "Accept" header in the request
    res.format({
      // if "text/html", ..., if "application/json", ...
      "text/html": () => {
        res.render("hospitals/show", {
          hospital,
          title: "Hospital View",
        });
      },
      "application/json": () => {
        res.json({ hospital });
      },
      //if the "Accept" header is not "text/html" or "application/json", then:
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    console.log("error in show of HospitalController");
    next(error);
  }
};

export const add = async (req, res, next) => {
  try {
    res.render("hospitals/add", {
      //"hospitals/add" means "/views/hospitals/add.ejs"
      formType: "create",
      title: "New Hospital",
    });
  } catch (error) {
    console.log("error in add of HospitalController");
    next(error);
  }
};

export const edit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Missing required ID");

    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      req.status = 404;
      throw new Error("Hospital does not exist");
    }

    res.format({
      // if "text/html", ..., if "application/json", ...
      "text/html": () => {
        res.render("hospitals/edit", {
          hospital,
          formType: "update",
          title: "Edit Hospital",
        });
      },
      "application/json": () => {
        res.json({ hospital });
      },
      //if the "Accept" header is not "text/html" or "application/json", then:
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    console.log("error in edit of HospitalController");
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { hospitalName, location } = req.body;

    const hospital = new Hospital({ hospitalName, location });

    await hospital.save();

    res.format({
      "text/html": () => {
        //set notification to session, and this will work with "/app.js" notification setting
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "hospital was created successfully",
          },
        ];
        res.redirect("/hospitals");
        /* redirect to the index page, we don't use "render" because the user may 
			     hit refresh and post again */
      },
      "application/json": () => {
        res.status(201).json({ status: 201, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });

    //redirect to the index page, we don't use "render" because the user may hit refresh and post again
    res.redirect("hospitals");
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Failed to Create the Hospital." },
    ];
    console.log("error in create of HospitalController");
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { hospitalName, location } = req.body;

    const hospital = await Hospital.findById(req.params.id);
    //console.log(hospital);

    if (!hospital) {
      req.status = 404;
      throw new Error("Hospital does not exist");
    }

    hospital.hospitalName = hospitalName;
    hospital.location = location;

    await hospital.save();

    res.format({
      "text/html": () => {
        //set notification to session, and this will work with "/app.js" notification setting
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Hospital was updated successfully",
          },
        ];
        res.redirect("/hospitals");
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
      { alertType: "alert-danger", message: "Hospital failed to update" },
    ];
    console.log("error in update of HospitalController");
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      req.status = 404;
      throw new Error("Hospital does not exist");
    }

    await Hospital.findByIdAndDelete(req.params.id);

    res.format({
      "text/html": () => {
        //set notification to session, and this will work with "/app.js" notification setting
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "hospital was deleted successfully",
          },
        ];
        res.redirect("/hospitals");
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    //set notification to session, and this will work with "/app.js" notification setting
    req.session.notifications = [
      { alertType: "alert-danger", message: "hospital failed to delete" },
    ];
    console.log("error in remove of HospitalController");
    next(error);
  }
};

import DoctorService from "../services/DoctorService.js"; // also include APIProvider.js

export const index = async (_, res, __) => {
  try {
    const doctorService = await DoctorService; // contains retrieving data logic
    const doctors = await doctorService.index(); // use the function from DoctorService.js

    res.json(doctors);
  } catch (error) {
    console.error(error);

    res.json([]);
  }
};

export const show = async (req, res, _) => {
  try {
    const doctorService = await DoctorService; // contains retrieving data logic
    const doctor = await doctorService.show(req.params.id); // use the function from DoctorService.js

    res.json(doctor);
  } catch (error) {
    console.error(error);

    res.json({});
  }
};

export const create = async (req, res, _) => {
  try {
    const doctorService = await DoctorService;
    await doctorService.create(req.body, req.headers.cookie);

    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(404).json({ error });
  }
};

export const update = async (req, res, _) => {
  try {
    const doctorService = await DoctorService;
    await doctorService.update(req.params.id, req.body, req.headers.cookie);

    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(404).json({ error });
  }
};

import HospitalService from "../services/HospitalService.js"; // also include APIProvider.js

export const index = async (_, res, __) => {
  try {
    const hospitalService = await HospitalService; // contains retrieving data logic
    const hospitals = await hospitalService.index(); // use the function from HospitalService.js

    res.json(hospitals);
  } catch (error) {
    console.error(error);

    res.json([]);
  }
};

export const show = async (req, res, _) => {
  try {
    const hospitalService = await HospitalService; // contains retrieving data logic
    const hospital = await hospitalService.show(req.params.id); // use the function from HospitalService.js

    res.json(hospital);
  } catch (error) {
    console.error(error);

    res.json({});
  }
};

import APIProvider from "../utilities/APIProvider.js";

const HospitalService = (async () => {
    const apiProvider = await APIProvider(); // axios instance

    return {
        index: async () => {
            try {                
                const hospitals = await apiProvider.get("/hospitals");
                /* run router.get("/hospitals", applicationAuthenticate, hospitalIndex); in 
                SERVER/routes/APIRoutes.js */

                return hospitals.data?.hospitals || [];
            } catch (error) {
                console.log("error in HospitalService.index", error);
                throw error;
            }
        },

        show: async (id) => {
            try {
                const hospital = await apiProvider.get(`/hospitals/${id}`);
                /* run router.get("/hospitals/:id", applicationAuthenticate, hospitalShow); in 
                SERVER/routes/APIRoutes.js */

                return hospital.data?.hospital || {};
            } catch (error) {
                console.log("error in HospitalService.show", error);
                throw error;
            }
        },
    };
})(); // The immediately-invoked function expression (IIFE)

export default HospitalService;
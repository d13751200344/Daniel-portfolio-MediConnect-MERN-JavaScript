import APIProvider from "../utilities/APIProvider.js";

const UserService = (async () => {
  const apiProvider = await APIProvider(); // axios instance

  return {
    // we will get id and cookies from requests through the controller
    show: async (id, cookies) => {
      //cookies is for authentication
      try {
        /* use axios to run 
        router.get("/users/:id", applicationAuthenticate, isAuthenticated, userShow); 
        in SERVER/routes/APIRoutes.js */
        const user = await apiProvider.get(`/users/${id}`, {
          headers: {
            Cookie: cookies,
          }, // because we need to authenticate the user, we need to send the cookies
        });

        return user.data?.user || {};
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    // we need to fake a form and submit it to the server
    create: async (user) => {
      //user is req.body in the controller
      try {
        const formData = new FormData(); // create a new form data

        // user table has fields, and we use Object[key, value] to map the fields
        Object.keys(user).forEach((key) => {
          // append the user data (fields' names & values) to the form data
          formData.append(key, user[key]);
        });

        // post the form data to the server (includs path, data, and headers)
        /* use axios to run 
        router.post("/users", applicationAuthenticate, upload.single("avatar"), userCreate); 
        in SERVER/routes/APIRoutes.js */
        await apiProvider.post("/users", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    //user is req.body, id is req.params.id, and cookies is req.headers.cookie
    update: async (id, user, cookies) => {
      //cookies is for authentication
      try {
        // fake a form and submit it to the server, same as create
        const formData = new FormData();

        Object.keys(user).forEach((key) => {
          formData.append(key, user[key]);
        });

        /* use axios to run
        router.put("/users/:id", applicationAuthenticate, isAuthenticated, 
        upload.single("avatar"), userUpdate);
        in SERVER/routes/APIRoutes.js */
        await apiProvider.put(`/users/${id}`, formData, {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies,
          }, // because we need to authenticate the user, we need to send the cookies
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    authenticate: async (user) => {
      try {
        /* post the user data to the server to authenticate the user and the application
        use axios to run
        router.post("/users/authenticate", userAuthenticate);
        in SERVER/routes/APIRoutes.js */
        const response = await apiProvider.post("/users/authenticate", user);

        return { headers: response.headers, data: response.data?.user };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout: async (cookies) => {
      //cookies is for authentication
      try {
        /* use axios to run router.post("/users/logout", userLogout);
        in SERVER/routes/APIRoutes.js */
        await apiProvider.post(
          //path, data, and headers
          "/users/logout",
          {},
          {
            headers: {
              Cookie: cookies, // for authenticating the user, we need to send the cookies
            },
          }
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };
})(); // The immediately-invoked function expression (IIFE)
/* The reason we do IIFE is that it allows us to run async & await */

export default UserService;

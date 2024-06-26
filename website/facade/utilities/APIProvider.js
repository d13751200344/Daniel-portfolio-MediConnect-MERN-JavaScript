import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
axios.defaults.withCredentials = true;

/* when we authenticate, we get a token that we can use to make requests to the API
- This is like our "secret key" holder. Initially, it's empty because we haven't asked for it yet. */
let token = null;

// Imagine this function is like asking a guard for a new pass because ours is expired or we lost it.
async function refreshToken() {
  /* We ask the "guard" (our server) for a new pass by proving who we are with our key and secret. 
    - send a post request to /authenticate, and "/SERVER/routes/APIRoutes.js" will trigger requestToken method : router.post("/authenticate", requestToken);
    */
  const uri = `${process.env.API_ENDPOINT}/authenticate`;

  // axios.post(uri, `data we want to pass`, `config: headers, etc.`)
  const response = await axios.post(
    uri,
    {
      key: process.env.API_KEY,
      secret: process.env.API_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  token = response.data.token; // The guard gives us a new pass (token), and we keep it safe.
  return token; // Then we show this new pass every time we need to prove who we are.
}

// This is like creating a special phone that automatically adds our pass (token) every time we make a call.
async function APIProvider() {
  if (!token) {
    await refreshToken(); // If we realize we don't have a pass when we're about to make a call, we ask for one first.
  }

  /* Here we set up our special phone with the default settings, like who to call (API_ENDPOINT) and how long to wait for an answer (timeout).
    - This is what we did in Postman setting */
  const config = {
    baseURL: process.env.API_ENDPOINT,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // We tape our pass (token) to the back of our phone.
    },
  };
  /* We create a special phone with the settings we just defined. axios.create() is to create a new instance of axios with custom settings. */
  const instance = axios.create(config);

  /* - Axios can intercept request or response and allow us to make modifications before anything goes off. */

  /* Every time we make a call, this ensures our pass (token) is still taped on the back. */
  instance.interceptors.request.use(
    async (config) => {
      config.headers["Authorization"] = `Bearer ${token}`; // redundant, but we can check if our pass is still good before making a call.
      return config;
    },
    (error) => {
      return Promise.reject(error); // If something goes wrong, like our tape fails, we get notified.
    }
  );

  // If someone on the other end says our pass is no good (expired or invalid), we handle that.
  instance.interceptors.response.use(
    (response) => {
      return response; // If everything is fine, just continue with the call.
    },
    async (error) => {
      console.log(error.response);

      const originalRequest = error.config; // This is like remembering the number we were dialing.

      // If the reason our call didn't go through was specifically because our pass was no good...
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // We make a note not to end up in an endless loop of trying the same bad pass.

        token = await refreshToken(); // We get a new pass.

        originalRequest.headers["Authorization"] = `Bearer ${token}`; // We tape the new pass to our phone.

        return instance(originalRequest); // And then we redial the number we were trying to call initially.
      }

      console.log(error.response?.data);
      return Promise.reject(error.response?.data || error); // If the call didn't go through for any other reason, we just accept the call failed.
    }
  );

  return instance; // Here's our special phone, ready to use.
}

export default APIProvider; // We make our special phone available to anyone in our app who needs to make calls.

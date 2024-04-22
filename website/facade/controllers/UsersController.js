import UserService from "../services/UserService.js"; // also include APIProvider.js

export const show = async (req, res, _) => {
  try {
    const userService = await UserService; // contains logic; we don't need () cause we used IIFE

    // use the function from UserService.js
    const user = await userService.show(req.params.id, req.headers.cookie);

    res.json(user);
  } catch (error) {
    console.error(error);

    res.json({});
  }
};

export const create = async (req, res, _) => {
  try {
    const userService = await UserService;
    await userService.create(req.body);

    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(404).json({ error });
  }
};

export const update = async (req, res, _) => {
  try {
    const userService = await UserService;
    await userService.update(req.params.id, req.body, req.headers.cookie);

    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(404).json({ error });
  }
};

export const authenticate = async (req, res, _) => {
  try {
    const userService = await UserService;
    // authenticate the user, and then get the headers and data
    const { headers, data } = await userService.authenticate(req.body);

    // create a session: get the cookie that starts with "connect.sid" (if it exists)
    const session = headers["set-cookie"]?.find((cookie) =>
      cookie.startsWith("connect.sid=")
    );

    // if there is no session (means no set-cookie or, no cookie that starts with "connect.sid" found in the request headers), throw an error
    if (!session) throw new Error("INVALID CREDENTIALS");

    // if no problem, hijack the session and set the cookie in the response header
    res.setHeader("Set-Cookie", session);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(403).json({ error });
  }
};

export const logout = async (req, res, _) => {
  try {
    const userService = await UserService;
    await userService.logout(req.headers.cookie);

    // { path: "/" } means clear the cookie from the root path
    res.clearCookie("connect.sid", { path: "/" });
    res.clearCookie("user", { path: "/" });

    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(404).json({ error });
  }
};

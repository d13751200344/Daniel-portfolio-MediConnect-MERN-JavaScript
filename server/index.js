import app from "./app.js";

//pick a port randomly to listen to the server
const port = process.env.PORT || 5200;
//const port = process.env.PORT ? process.env.PORT : 5200;

const server = app.listen(port, () =>
  console.log(`Listening on http://localhost:${port}`)
);
// node index.js to run the server and go to http://localhost:5200 to see the result

export default server;

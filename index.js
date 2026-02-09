import http from "http";
import handleRequest from "./router.js";

const HOSTNAME = "localhost";
const PORT = 3004;

const server = http.createServer(handleRequest);

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at ${HOSTNAME}:${PORT}`);
});

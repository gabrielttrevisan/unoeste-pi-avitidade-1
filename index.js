import http from "http";

const HOSTNAME = "localhost";
const PORT = 3004;

const server = http.createServer();

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at ${HOSTNAME}:${PORT}`);
});

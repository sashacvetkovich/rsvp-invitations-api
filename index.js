require("dotenv").config({ path: __dirname + "/.env" });
const http = require("http");
const app = require("./app");

const pool = require('./config/index')

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

(async () => {
    // const now = await pool.query("SELECT NOW()");
    // console.log(now)
  })();

server.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));

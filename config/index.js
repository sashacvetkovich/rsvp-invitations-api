require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";
const database =
  process.env.NODE_ENV === "test"
    ? process.env.POSTGRES_DB_TEST
    : process.env.POSTGRES_DB;

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${database}`;
const pool = new Pool({
  connectionString,
  /*
    SSL is not supported in development
    */
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

const whitelist = ["https://www.invitewave.com"];
const whitelistDevelop = ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions = {
  credentials: true,
  origin: isProduction ? whitelist : whitelistDevelop,
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
  corsOptions,
};

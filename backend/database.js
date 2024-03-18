import mysql from "mysql";

export const db = mysql.createConnection({
  host: "monorail.proxy.rlwy.net",
  user: "root",
  password: "ecixWHBhZzjmDNBdYyaFIbxOwpbBYvSM",
  database: "railway",
});
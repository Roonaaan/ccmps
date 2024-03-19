import mysql from "mysql";

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust this value as needed
  host: "localhost",
  user: "root",
  password: "", // Enter your MySQL password here
  database: "ccdb",
});

// Function to execute SQL queries
export const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      // Execute the query with the provided parameters
      connection.query(query, params, (err, results) => {
        // Release the connection back to the pool
        connection.release();
        if (err) {
          return reject(err);
        }
        // Resolve with the query results
        resolve(results);
      });
    });
  });
};
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgres://default:NpLQ8gFc1dsD@ep-aged-meadow-a1op3qk0-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

(async () => {
  try {
    await pool.query('SELECT NOW()'); // Simple query to test connection
    console.log('Connected to PostgreSQL database successfully!');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
  } finally {
    // Close the pool when the script finishes or errors occur
    await pool.end();
  }
})();
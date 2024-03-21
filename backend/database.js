import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
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
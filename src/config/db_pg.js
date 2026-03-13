import pg from 'pg'
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.PG_HOST,
  ssl: { rejectUnauthorized: false }
});

export default pool;
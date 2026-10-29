import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Check if DATABASE_URL exists (Neon Cloud), otherwise fallback to local variables
const pool = process.env.DATABASE_URL
  ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
  : new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

// Automatic retry for transient serverless pooler TLS resets and DNS hiccups
const rawQuery = pool.query.bind(pool);
pool.query = async (...args) => {
  const maxAttempts = 3;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await rawQuery(...args);
    } catch (err) {
      lastErr = err;
      const isTransient = 
        err.code === 'ECONNRESET' || 
        err.code === 'ENOTFOUND' || 
        err.code === 'ETIMEDOUT' || 
        err.code === 'EAI_AGAIN' ||
        err.message?.includes('socket disconnected') ||
        err.message?.includes('Connection terminated');

      if (isTransient && attempt < maxAttempts) {
        console.warn(`[DB Pool] Retrying query (attempt ${attempt + 1}/${maxAttempts}) after transient error: ${err.code || err.message}`);
        await new Promise((r) => setTimeout(r, attempt * 800));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
};

pool.on('error', (err) => {
  // Non-fatal warning for serverless pooler disconnects
  console.warn('[DB Pool Warning] Idle client connection reset:', err.message);
});

export default pool;

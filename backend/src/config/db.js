const { Pool } = require('pg');

let pool = null;
let useInMemory = false;

/**
 * Try to connect to PostgreSQL if DATABASE_URL is configured.
 * Falls back to in-memory mode if not configured or connection fails.
 */
function initPool() {
  const dbUrl = process.env.DATABASE_URL;

  // Check if DATABASE_URL is set and not a placeholder
  if (!dbUrl || dbUrl.includes('YOUR_PROJECT_REF') || dbUrl.includes('YOUR_PASSWORD')) {
    console.log('⚠️  DATABASE_URL not configured — running in IN-MEMORY mode');
    console.log('   To use PostgreSQL, update backend/.env with your Supabase connection string');
    useInMemory = true;
    return null;
  }

  try {
    const p = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false, // Required for Supabase connections
      },
    });

    // Test the connection on startup
    p.on('connect', () => {
      console.log('✅ Connected to PostgreSQL database');
    });

    p.on('error', (err) => {
      console.error('❌ Database pool error:', err.message);
      console.log('⚠️  Switching to IN-MEMORY mode');
      useInMemory = true;
    });

    return p;
  } catch (err) {
    console.error('❌ Failed to create database pool:', err.message);
    console.log('⚠️  Running in IN-MEMORY mode');
    useInMemory = true;
    return null;
  }
}

pool = initPool();

/**
 * Check if we are running in in-memory mode
 */
function isInMemoryMode() {
  return useInMemory;
}

module.exports = { pool, isInMemoryMode };

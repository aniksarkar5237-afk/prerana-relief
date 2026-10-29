import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
  try {
    const filename = process.argv[2] || '002_agents_and_proofs.sql';
    const migrationPath = path.join(__dirname, 'migrations', filename);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`Executing migration: ${filename}...`);
    await pool.query(sql);
    console.log('Migration executed successfully.');
  } catch (error) {
    console.error('Error executing migration:', error);
  } finally {
    pool.end();
  }
};

runMigration();

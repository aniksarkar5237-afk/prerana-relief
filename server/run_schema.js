import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log(`Executing schema: schema.sql...`);
    await pool.query(sql);
    console.log('Schema executed successfully.');
  } catch (error) {
    console.error('Error executing schema:', error);
  } finally {
    pool.end();
  }
};

runSchema();

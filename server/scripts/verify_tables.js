import pool from '../config/db.js';

async function check() {
  const tables = await pool.query(
    `SELECT table_name, column_name, data_type 
     FROM information_schema.columns 
     WHERE table_name IN ('villages', 'safe_zones', 'victims', 'sos_pings')
     ORDER BY table_name, ordinal_position;`
  );
  
  const indexes = await pool.query(
    `SELECT tablename, indexname 
     FROM pg_indexes 
     WHERE tablename IN ('villages', 'safe_zones', 'victims', 'sos_pings')
     ORDER BY tablename, indexname;`
  );

  console.log('=== CREATED TABLES & COLUMNS IN POSTGRESQL ===');
  const grouped = {};
  for (const row of tables.rows) {
    if (!grouped[row.table_name]) grouped[row.table_name] = [];
    grouped[row.table_name].push(`${row.column_name} (${row.data_type})`);
  }
  console.log(grouped);

  console.log('\n=== CREATED INDEXES IN POSTGRESQL ===');
  const groupedIdx = {};
  for (const row of indexes.rows) {
    if (!groupedIdx[row.tablename]) groupedIdx[row.tablename] = [];
    groupedIdx[row.tablename].push(row.indexname);
  }
  console.log(groupedIdx);

  process.exit(0);
}

check().catch(e => { console.error(e); process.exit(1); });

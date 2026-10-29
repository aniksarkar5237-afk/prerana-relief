import pool from './config/db.js';
import { handleUssdWebhook } from './controllers/ussdController.js';

async function benchmark() {
  // Warm up connection
  await pool.query('SELECT 1');

  function createMockReqRes(body) {
    let responseBody = '';
    let statusCode = 200;
    const res = {
      status: (c) => { statusCode = c; return res; },
      setHeader: () => {},
      send: (d) => { responseBody = d; return res; },
    };
    return { req: { body, query: {} }, res, getOutput: () => ({ statusCode, responseBody }) };
  }

  console.log('--- Benchmarking Warm Latency (Sub-500ms Requirement) ---');
  const latencies = [];

  for (let i = 1; i <= 5; i++) {
    const t = createMockReqRes({ phoneNumber: '+919876543210', text: '1', sessionId: `sess_bench_${i}` });
    const s = Date.now();
    await handleUssdWebhook(t.req, t.res);
    const duration = Date.now() - s;
    latencies.push(duration);
    console.log(`Call #${i}: ${duration}ms (Response: ${t.getOutput().responseBody})`);
  }

  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  console.log(`\nAverage Response Latency: ${avg.toFixed(1)}ms (Target: < 500ms)`);
  process.exit(0);
}

benchmark();

const axios = require('axios');

async function testGet() {
  try {
    const res = await axios.get('https://t4e-testserver.onrender.com/api/dataset', { timeout: 10000 });
    console.log('SUCCESS:', res.data);
  } catch (e) {
    console.log('FAILED:', e.response?.status, e.response?.data || e.message);
  }
}
testGet();

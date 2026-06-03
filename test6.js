const axios = require('axios');

async function probe() {
  const urls = [
    'https://t4e-testserver.onrender.com/api/b/dataset',
    'https://t4e-testserver.onrender.com/api/dataset/b',
    'https://t4e-testserver.onrender.com/api/data',
    'https://t4e-testserver.onrender.com/api/issues',
    'https://t4e-testserver.onrender.com/api/sync',
    'https://t4e-testserver.onrender.com/dataset',
    'https://t4e-testserver.onrender.com/api/v1/dataset'
  ];

  const payload = { studentId: 'RUJITA BALAMURUGAN', password: '555393' };

  for (const url of urls) {
    try {
      let res = await axios.post(url, payload, { timeout: 5000 });
      console.log(`POST ${url}:`, res.data);
    } catch (e) {
      console.log(`POST ${url} ERROR:`, e.response?.status, e.message);
    }

    try {
      let res = await axios.get(url, { params: payload, timeout: 5000 });
      console.log(`GET ${url}:`, res.data);
    } catch (e) {
      console.log(`GET ${url} ERROR:`, e.response?.status, e.message);
    }
  }
}

probe();

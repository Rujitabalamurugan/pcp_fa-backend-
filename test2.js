const axios = require('axios');

async function test() {
  const urls = [
    'https://t4e-testserver.onrender.com/api/b/auth/login',
    'https://t4e-testserver.onrender.com/api/auth/login',
    'https://t4e-testserver.onrender.com/api/login',
    'https://t4e-testserver.onrender.com/api/setB/login'
  ];

  for (const url of urls) {
    try {
      console.log(`Testing POST ${url}`);
      const res = await axios.post(url, { studentId: 'RUJITA BALAMURUGAN', password: '555393' });
      console.log('SUCCESS:', res.data);
    } catch (e) {
      console.log('FAILED:', e.response?.status, e.response?.data || e.message);
    }
  }
}
test();

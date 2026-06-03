const axios = require('axios');

async function testFetch() {
  try {
    const res = await axios.get('https://t4e-testserver.onrender.com/api', {
      params: {
        studentId: 'RUJITA BALAMURUGAN',
        password: '555393'
      }
    });
    console.log('SUCCESS GET query params:', res.data);
  } catch (e) {
    console.log('FAILED GET query params:', e.response?.status, e.response?.data || e.message);
  }
}

testFetch();

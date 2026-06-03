const axios = require('axios');

async function testNumber() {
  try {
    const res = await axios.post('https://t4e-testserver.onrender.com/api/auth/login', { 
      studentId: 'RUJITA BALAMURUGAN', 
      password: 555393 // Integer!
    });
    console.log('SUCCESS:', res.data);
  } catch (e) {
    console.log('FAILED:', e.response?.status, e.response?.data || e.message);
  }
}
testNumber();

const axios = require('axios');

async function testFinal() {
  try {
    const payload = {
      studentId: "RUJITA BALAMURUGAN",
      set: "setB",
      password: "555393"
    };
    
    console.log('Testing payload:', payload);
    const authRes = await axios.post('https://t4e-testserver.onrender.com/api', payload);
    console.log('SUCCESS API Root:', authRes.data);
    
    // Also try the login endpoint just in case
    const authRes2 = await axios.post('https://t4e-testserver.onrender.com/api/login', payload);
    console.log('SUCCESS API Login:', authRes2.data);
    
  } catch (e) {
    console.log('FAILED:', e.response?.status, e.response?.data || e.message);
  }
}
testFinal();

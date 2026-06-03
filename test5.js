const axios = require('axios');

async function testForms() {
  try {
    const res = await axios.post('https://t4e-testserver.onrender.com/api', 
      new URLSearchParams({ studentId: 'RUJITA BALAMURUGAN', password: '555393' }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('FORM URLENCODED POST:', res.data);
  } catch(e) {
    console.error('FORM URLENCODED POST ERROR:', e.message);
  }

  try {
    const res = await axios.post('https://t4e-testserver.onrender.com/api/login', 
      new URLSearchParams({ studentId: 'RUJITA BALAMURUGAN', password: '555393' }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('FORM URLENCODED POST /login:', res.data);
  } catch(e) {
    console.error('FORM URLENCODED POST ERROR:', e.message);
  }
}

testForms();

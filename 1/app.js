const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const WINDOW_SIZE = 10;
let window = [];

// Test server URLs
const TEST_SERVER_URLS = {
  'p': 'http://20.244.56.144/test/primes',
  'f': 'http://20.244.56.144/test/fibo',
  'e': 'http://20.244.56.144/test/even',
  'r': 'http://20.244.56.144/test/rand'
};
const fetchNumbers = async (numberid) => {
    try {
      const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MDYwMjM4LCJpYXQiOjE3MTcwNTk5MzgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjU2MWJiYjk0LWFkYjEtNGQ4My1hODk4LTg1MjlmYzcwNDY4NSIsInN1YiI6ImFiaGluYXZzcmkyMDRAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiR2FsZ290aWFzIFVuaXZlcnNpdHkiLCJjbGllbnRJRCI6IjU2MWJiYjk0LWFkYjEtNGQ4My1hODk4LTg1MjlmYzcwNDY4NSIsImNsaWVudFNlY3JldCI6ImFLc3RUSlBxckFpWUZCSlAiLCJvd25lck5hbWUiOiJBYmhpbmF2IFNyaXZhc3RhdmEiLCJvd25lckVtYWlsIjoiYWJoaW5hdnNyaTIwNEBnbWFpbC5jb20iLCJyb2xsTm8iOiIyMTEzMTAxMjU1NCJ9.rK766LepIXh8WS6lCcOg2weKU0AogYWb2RoiGd6-Q7g';
  
      const response = await axios.get(TEST_SERVER_URLS[numberid], {
        headers: {
          'Authorization': authToken
        },
        timeout: 500
      });
  
      console.log(`Response from ${TEST_SERVER_URLS[numberid]}:`, response.data.numbers);
      
      if (response.status === 200) {
        return response.data.numbers || [];
      }
    } catch (error) {
      console.error(`Error fetching numbers from ${TEST_SERVER_URLS[numberid]}:`, error.message);
    }
    return [];
  };
  
  
  

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const newNumbers = await fetchNumbers(numberid);
  const windowPrevState = [...window];

  newNumbers.forEach((number) => {
    if (number % 2 === 0 && !window.includes(number)) { // Check if number is even and not already in window
      window.push(number);
      if (window.length > WINDOW_SIZE) {
        window.shift(); // Remove the oldest number
      }
    }
  });

  const avg = window.length ? (window.reduce((sum, num) => sum + num, 0) / window.length).toFixed(2) : 0.00;

  const response = {
    "numbers": newNumbers,
    "windowPrevState": windowPrevState,
    "windowCurrState": window,
    "avg": parseFloat(avg)
  };

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

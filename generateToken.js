const jwt = require('jsonwebtoken');

// Lag en test-token
const token = jwt.sign(
  { id: '12345', username: 'testuser', email: 'testuser@example.com' }, // Dummy user info
  'your_jwt_secret', // Erstatt med din hemmelige nøkkel
  { expiresIn: '1h' } // Tokenet utløper etter 1 time
);

console.log(token); // Skriv ut tokenen til konsollen

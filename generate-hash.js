const bcrypt = require('bcryptjs');

// Create a hash for the password "password"
const password = "password";

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(`Password: "${password}"`);
    console.log(`Hash: "${hash}"`);
    
    // Verify the hash
    bcrypt.compare(password, hash, (err, isMatch) => {
      console.log(`Verification: ${isMatch ? 'Success' : 'Failed'}`);
    });
  });
});
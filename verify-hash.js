const bcrypt = require('bcryptjs');

async function verifyHash() {
  const password = "password";
  const storedHash = "$2a$10$9rLTJxxGTQCzzeoiDdLgPe9m2WpBUXVtvBz.LJcR3BMbLH0VO1S4W";
  
  try {
    // Check if the stored hash matches the password
    const isMatch = await bcrypt.compare(password, storedHash);
    console.log('Password matches stored hash:', isMatch);
    
    // Generate a new hash for reference
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(password, salt);
    console.log('New hash for "password":', newHash);
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyHash();

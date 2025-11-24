const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('123456', 8);
console.log(hash);

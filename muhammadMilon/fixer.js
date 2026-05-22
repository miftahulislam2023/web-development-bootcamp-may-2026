const fs = require('fs');
let c = fs.readFileSync('utils/exportCode.js', 'utf8');
c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('utils/exportCode.js', c);
console.log('done');

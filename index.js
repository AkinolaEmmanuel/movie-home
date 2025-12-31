const path = require('path');
const fs = require('fs');

const target = path.join(__dirname, 'server', 'dist', 'index.js');

if (fs.existsSync(target)) {
  require(target);
} else {
  console.error('Compiled server entry not found at server/dist/index.js.');
  console.error('Ensure the project build runs before start (Build command: "npm run build").');
  console.error('On Render set Build Command: "npm run build" and Start Command: "node index.js" (or "npm start").');
  process.exit(1);
}

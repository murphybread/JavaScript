// postinstall.js
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'commit-convention', 'murphy-commit-msg');
const destinationDir = path.join(__dirname, '..', '.git', 'hooks');
const destination = path.join(destinationDir, 'murphy-commit-msg');

if (!fs.existsSync(source)) {
  console.error('murphy-commit-msg file not found.');
  process.exit(1);
}

if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

fs.copyFileSync(source, destination);
fs.chmodSync(destination, '755');

console.log('murphy-commit-msg has been copied to .git/hooks. Please rename it to commit-msg.');

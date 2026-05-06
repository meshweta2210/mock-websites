const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

for (let i = 2; i <= 10; i++) {
  const website = `website ${i}`;
  const cwd = path.join(__dirname, website);

  if (!fs.existsSync(cwd)) {
    console.error(`Error: ${website} folder not found`);
    process.exit(1);
  }

  console.log(`Installing dependencies for ${website}...`);
  try {
    execSync('npm install', { cwd, stdio: 'inherit' });
    console.log(`✓ ${website} dependencies installed`);
  } catch (error) {
    console.error(`✗ Failed to install dependencies for ${website}`);
    process.exit(1);
  }
}

console.log('\n✓ All websites dependencies installed successfully!');

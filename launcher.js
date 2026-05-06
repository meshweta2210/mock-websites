const { spawn } = require('child_process');
const path = require('path');

const websites = [
  { folder: 'website 1', port: 3001, company: 'XNC' },
  { folder: 'website 2', port: 3002, company: 'Taurus' },
  { folder: 'website 3', port: 3003, company: 'Pisces' },
  { folder: 'website 4', port: 3004, company: 'Libra' },
  { folder: 'website 5', port: 3005, company: 'Scorpio' },
  { folder: 'website 6', port: 3006, company: 'Leo' },
  { folder: 'website 7', port: 3007, company: 'Virgo' },
  { folder: 'website 8', port: 3008, company: 'Gemini' },
  { folder: 'website 9', port: 3009, company: 'Aries' },
  { folder: 'website 10', port: 3010, company: 'Aquarius' }
];

const processes = [];

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         Nine Mock Websites - Launching All Sites           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

websites.forEach(site => {
  const cwd = path.join(__dirname, site.folder);
  const child = spawn('node', ['server.js'], {
    cwd,
    env: { ...process.env, PORT: site.port },
    stdio: 'inherit'
  });

  processes.push(child);
  console.log(`✓ Started ${site.folder} (${site.company}) on port ${site.port}`);

  // Handle errors
  child.on('error', (err) => {
    console.error(`✗ Error starting ${site.folder}: ${err.message}`);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`✗ ${site.folder} exited with code ${code}`);
    }
  });
});

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  All websites running! Press Ctrl+C to shutdown all.     ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n╔════════════════════════════════════════════════════════════╗');
  console.log('║            Shutting down all servers...                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  processes.forEach((p, index) => {
    p.kill();
    console.log(`✓ Stopped ${websites[index].folder}`);
  });

  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

// Handle other signals
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM signal - shutting down gracefully...');
  processes.forEach(p => p.kill());
  process.exit(0);
});

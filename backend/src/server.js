const app = require('./app');

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  ⛏️  MINECRAFT: THE DEADLOCK SURVIVAL            ║');
  console.log('║  🎮  Banker\'s Algorithm Backend Server            ║');
  console.log(`║  🚀  Running on http://localhost:${PORT}           ║`);
  console.log('╚══════════════════════════════════════════════════╝');
});

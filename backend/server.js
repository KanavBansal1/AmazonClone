// require('dotenv').config();
// const app = require('./src/app');

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`
//   🚀 Amazon Clone API Server
//   ===========================
//   Port:     ${PORT}
//   Mode:     ${process.env.NODE_ENV || 'development'}
//   Health:   http://localhost:${PORT}/api/health
//   ===========================
//   `);
// });

require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 Amazon Clone API Server
  ===========================
  Port:     ${PORT}
  Mode:     ${process.env.NODE_ENV || 'development'}
  Health:   https://amazonclone-205s.onrender.com/api/health
  ===========================
  `);
});
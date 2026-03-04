require('dotenv').config()
import app from './app';

const PORT = process.env.PORT || 3000;

// Basic server style 'loop,' the server will listen for all request directed to 
// 'PORT'. 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
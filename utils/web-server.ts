/**
 * Simple web server for Link Organizer
 * Run: npm run links:web
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const PORT = 3000;
const WEB_DIR = path.join(__dirname, '../web');
const DATA_DIR = path.join(__dirname, '../data');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API endpoint to get links
  if (req.url === '/api/links' && req.method === 'GET') {
    const linksPath = path.join(DATA_DIR, 'links.json');
    try {
      const data = fs.readFileSync(linksPath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to read links' }));
    }
    return;
  }

  // API endpoint to save links
  if (req.url === '/api/links' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const linksPath = path.join(DATA_DIR, 'links.json');
        fs.writeFileSync(linksPath, JSON.stringify(data, null, 2), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to save links' }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(WEB_DIR, req.url === '/' ? 'index.html' : req.url || '');

  // Security: prevent directory traversal
  if (!filePath.startsWith(WEB_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 Link Organizer Web Interface');
  console.log('='.repeat(60));
  console.log('');
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('📱 Mobile Access:');
  console.log('   - Connect your phone to the same WiFi network');
  console.log('   - Open browser and go to: http://[your-computer-ip]:3000');
  console.log('   - Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)');
  console.log('');
  console.log('💡 Tips:');
  console.log('   - Use the Sync tab to load/save your links.json data');
  console.log('   - Bookmark the page on your phone for easy access');
  console.log('   - Press Ctrl+C to stop the server');
  console.log('');
  console.log('='.repeat(60));
  console.log('');
});

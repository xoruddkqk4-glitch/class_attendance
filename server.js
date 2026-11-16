const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const MAX_BODY_BYTES = 5 * 1024 * 1024;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/export.xlsx') {
    const chunks = [];
    let totalBytes = 0;
    let payloadTooLarge = false;

    for await (const chunk of req) {
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        payloadTooLarge = true;
        req.destroy();
        break;
      }
      chunks.push(chunk);
    }

    if (payloadTooLarge) {
      res.writeHead(413, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Payload too large');
    }

    try {
      const body = Buffer.concat(chunks).toString('utf8');
      const { buildAttendanceWorkbook } = await import('./excel-export.mjs');
      const bytes = await buildAttendanceWorkbook(JSON.parse(body));
      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="attendance-records.xlsx"'
      });
      return res.end(bytes);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Excel export failed');
    }
  }

  let requestedPath = '/';
  try {
    requestedPath = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad request');
  }

  const file = path.resolve(root, `.${requestedPath}`);
  const rel = path.relative(root, file);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(8080, '127.0.0.1', () => console.log('학급 출석부: http://127.0.0.1:8080'));

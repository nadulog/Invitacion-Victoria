const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };
const publicFiles = new Set([
  'index.html', 'styles.css', 'gallery.css', 'plates.css', 'script.js',
  'assets/bloomdate-logo.svg', 'assets/wonderwall.mp3',
  'assets/portada-violeta.png', 'assets/portada-violeta-logo.png', 'assets/fecha-violeta.png',
  'assets/ubicacion-violeta.png', 'assets/confirmacion-violeta.png',
  'assets/cuenta-regresiva-limpia.png', 'assets/musica.png',
  'assets/dress-code-violeta.png', 'assets/intro-violeta-estrellas.png',
  'assets/bloomkeep-victoria.png',
  'assets/frase-violeta.png', 'assets/frase-violeta-v2.png',
  'assets/galeria-violeta-1.jpeg', 'assets/galeria-violeta-2.jpeg',
  'assets/galeria-violeta-3.jpeg', 'assets/galeria-violeta-4.jpeg',
  'assets/galeria-violeta-5.jpeg'
]);

const httpServer = http.createServer((req, res) => {
  const clean = decodeURIComponent(req.url.split('?')[0]);
  const relative = clean === '/' ? 'index.html' : clean.replace(/^\/+/, '');
  if (!publicFiles.has(relative)) {
    res.writeHead(404).end('No encontrado');
    return;
  }
  const file = path.resolve(root, relative);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('No encontrado');
    return;
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
});
const port = Number(process.env.PORT || 8766);
httpServer.listen(port, '0.0.0.0');

const http = require('http');
const express = require('express');
const ws = require('ws');

const PORT = process.env['PORT'] || 8000;

const app = express();
app.use(express.static(__dirname));
const server = http.createServer(app);
const wss = new ws.Server({server});
const connections = [];
const _isValidConnection = c => c && c.readyState === ws.OPEN;
wss.on('connection', (c, req) => {
  const {url} = req;
  console.log(url);

  c.on('message', s => {
    const m = JSON.parse(s);
    const {id} = m;
    const c2 = connections[id];

    if (_isValidConnection(c2)) {
      const {message} = m;
      c2.send(JSON.stringify({
        type: 'message',
        message,
      }));
      c.send(JSON.stringify({
        type: 'response',
        result: null,
      }));
    } else {
      c.send(JSON.stringify({
        type: 'response',
        error: 'no such peer: ' + JSON.stringify({id, peers: Object.keys(connections).filter(k => _isValidConnection(connections[k]))}),
      }));
    }
  });
  c.on('close', m => {
    connections[url] = null;
  });

  connections[url] = c;
});

server.listen(PORT);

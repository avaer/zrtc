const PORT = process.env['PORT'];

const ws = require('ws');
const server = ws.createServer({
  port: PORT,
});
const connections = [];
wss.on('connection',c => {
  c.on('message', m => {
    c.send(m + ':response');
  });
  c.on('close', m => {
    connections.splice(connections.indexOf(c), 1);
  });

  connections.push(c);
});

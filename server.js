const http = require('http');
const express = require('express');

const app = express();

app.set('port', process.env.PORT || 300);

app.use(express.static('public'));

const server = http.createServer(app);

const io = require('socket.io').listen(server);

if (app.get('env') === 'development') {
  const reload = require('reload');
  reload(server, app, true);

  const livereload = require('livereload');
  const lrserver = livereload.createServer();
  lrserver.watch(__dirname + '/public');
}

io.sockets.on('connection', function (socket) {
    console.log('New user connected!');
});

app.get('/constants.js', (req, res) => {
  res.contentType('application/javascript');
  res.send('' +
    'window.CONSTANTS = {' +
    '  env: "' + app.get('env') + '"' +
    '}'
  );
});

server.listen(app.get('port'), () => {
  console.info(`Running on http://localhost:${app.get('port')}/`);
});

const http = require('http');
const express = require('express');

let state = require('./state.js');

const app = express();

app.set('port', process.env.PORT || 300);

app.use(express.static('dist'));
app.use(express.static('public'));

const server = http.createServer(app);

const io = require('socket.io').listen(server);

if (app.get('env') === 'development') {
  const reload = require('reload');
  reload(server, app, true);

  const livereload = require('livereload');
  const lrserver = livereload.createServer();
  lrserver.watch(__dirname + '/dist');
}

io.sockets.on('connection', function (socket) {
  console.log('New user connected!');
  console.log('Socket id', socket.id);

  socket.on('new_player', (nickname) => {
    let player = state.game.players.find(player => player.nickname === nickname);

    if (!player) {
      const x = 300;
      const y = 300;

      player = {nickname, x, y};

      state.game.players.push(player);
    }

    socket.current = player;

    io.sockets.emit('load_player', player);
  });

  socket.on('update_player', (x, y, timestamp) => {
    let current = socket.current;
    if (!current) return;

    current.x = x;
    current.y = y;

    socket.broadcast.emit('draw_player', current, timestamp);
  });

  socket.on('new_projectile', p => {
    state.game.projectiles.push(p);
    socket.broadcast.emit('new_projectile', p);
  });
});

setInterval(() => {
  const now = new Date().getTime();
  state.game.timestamp = now;
  io.sockets.emit('timestamp', now);
}, 200);

app.get('/constants.js', (req, res) => {
  res.contentType('application/javascript');
  res.send('window.CONSTANTS = ' + JSON.stringify({
    env: app.get('env'),
    state
  }));
});

server.listen(app.get('port'), () => {
  console.info(`Running on http://localhost:${app.get('port')}/`);
});

setInterval(() => {
  state.game.monsters.forEach(monster => {
    var _rand = Math.floor(Math.random() * 4);
    if (_rand == 0)
      monster.y -= 16;
    else if (_rand == 1)
      monster.y += 16;
    else if (_rand == 2)
      monster.x -= 16;
    else if (_rand == 3)
      monster.x += 16;
    io.sockets.emit('draw_monster', monster);
  });
}, 100);

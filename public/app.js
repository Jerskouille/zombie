import Player from './player.js';

var state = CONSTANTS.state;

var $game = document.getElementById('game');
var $monsters = document.getElementById('monsters');

function updateMap(state) {
  var map = state.game.map;
  $game.style.width = map.width + 'px';
  $game.style.height = map.height + 'px'
  $game.style.marginTop = '-' + Math.round(map.width / 2) + 'px';
  $game.style.marginLeft = '-' + Math.round(map.width / 2) + 'px';
}

function updatePlayers(state) {
  state.game.players.forEach(p => {
    const player = new Player(p);
    player.$add();
    player.$draw();
    Player.list.push(player);
  });
}

function updateMonsters(state) {
  var monsters = state.game.monsters;
  var html = '';
  monsters.forEach(function (monster) {
    var selector ='[data-id="' + encodeURIComponent(monster.id) + '"]';
    var $current = $monsters.querySelector(selector);
    if ($current) return;

    var $monster = document.createElement('div');
    $monster.className = 'monster';
    $monster.style.left = monster.x + 'px'
    $monster.style.bottom = monster.y + 24 + 'px';
    $monster.setAttribute('data-id', encodeURIComponent(monster.id));

    $monsters.appendChild($monster);
  });
}

updateMap(state);
updatePlayers(state);
updateMonsters(state);

/* Socket.io */

var socket = io.connect('http://localhost:3100');

Player.nickname = localStorage.getItem('nickname');
if (!Player.nickname) {
  Player.nickname = prompt('What\'s your nickname?');
  localStorage.setItem('nickname', nickname);
}

socket.emit('new_player', Player.nickname);

socket.on('load_player', p => {
  let player = Player.find(p.nickname);

  if (!player) {
    player = new Player(p);
    player.$add();
    player.$draw();
    Player.list.push(player);
  }

  console.log('New player at position : ' + player.x + ' ' + player.y);
});

window.addEventListener('keydown', update, true);

function drawMonster (monster) {
  const monster2 = state.game.monsters.find(monster2 => monster.id === monster2.id);

  monster2.x = monster.x;
  monster2.y = monster.y;

  var selector ='[data-id="' + encodeURIComponent(monster.id) + '"]';
  var $current = $monsters.querySelector(selector);

  $current.style.left = monster.x + 'px'
  $current.style.bottom = monster.y + 'px';
}

function update(e) {
  if (e.defaultPrevented) return;
  const me = Player.me;

  function _update (key, params) {
    if (e.key !== key) return;
    me.update(params);
    socket.emit('update_player', me.x, me.y);
    e.preventDefault();
  }

  _update('ArrowDown', {y: me.y - 16});
  _update('ArrowUp', {y: me.y + 16});
  _update('ArrowLeft', {x: me.x - 16});
  _update('ArrowRight', {x: me.x + 16});
}

socket.on('draw_player', p => {
  const player = Player.find(p.nickname);
  player.update(p);
  player.$draw();
});

socket.on('draw_monster', function (monster) {
  drawMonster(monster);
});


function shot(event) {
  const me = Player.me;
  console.log(`X : ${event.clientX} et Y : ${event.clientY}`); // position click mouse
  console.log(`Mon X : ${me.x + 8}  et mon Y : ${me.y + 12}`); // position of the center of the player
}

document.addEventListener("click", shot);
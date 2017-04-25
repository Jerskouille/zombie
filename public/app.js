var map = CONSTANTS.state.game.map;

const mapRow = cell => (`<div class="cell" style="background-color: ${cell.color}"></div>`);
const mapHTML = map.map(row => (
  '<div class="row">' +
  '  ' + row.map(mapRow).join('') +
  '</div>'
)).join('');
document.querySelector('#map').innerHTML = mapHTML;

console.log(map);

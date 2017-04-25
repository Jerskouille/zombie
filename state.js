const MAP_SIZE = 48;

function createMap () {
  return new Array(MAP_SIZE).fill(null).map(() => (
    new Array(MAP_SIZE).fill(null).map(() => ({ color: 'red' }))
  ));
}

console.log(createMap());

module.exports = {
  game: {
    map: createMap()
  }
};

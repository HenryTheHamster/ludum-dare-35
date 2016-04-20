'use strict';
function p(id, path) {
  return 'players:' + id + '.' + path;
}

function up (state, input, data) {
  return [p(data.playerId, 'hammerwatch.avatar.velocity.y'), -1];
}

function down (state, input, data) {
  return [p(data.playerId, 'hammerwatch.avatar.velocity.y'), +1];
}

function left (state, input, data) {
  return [p(data.playerId, 'hammerwatch.avatar.velocity.x'), -1];
}

function right (state, input, data) {
  return [p(data.playerId, 'hammerwatch.avatar.velocity.x'), +1];
}

function stopSide (state, input, data) {
  return [p(data.playerId, 'hammerwatch.avatar.velocity.x'), 0];
}

function stopUp (state, input, data) {
  return [p(data.playerId, 'hammerwatch.avatar.velocity.y'), 0];
}

// function move (state, input, data) {
//   var position = state.unwrap(p(data.playerId, 'hammerwatch.avatar.position'));
//   var relativeX = input.x - position.x;
//   var relativeY = input.y - position.y;

//   if (Math.abs(relativeX) > Math.abs(relativeY)) {
//     return (relativeX > 0) ? right(state, 1, data) : left (state, 1, data);
//   } else {
//     return (relativeY < 0) ? up(state, 1, data) : down (state, 1, data);
//   }
// }

module.exports = {
  type: 'ActionMap',
  func: function Hammerwatch () {
    return {
      up: [ {call: up, noEventKey: 'stop-up'} ],
      down: [ {call: down, noEventKey: 'stop-up'} ],
      left: [ {call: left, noEventKey: 'stop-side'} ],
      right: [ {call: right, noEventKey: 'stop-side'} ],
      nothing: [
        {call: stopSide, noEventKey: 'stop-side'},
        {call: stopUp, noEventKey: 'stop-up'}
      ]
    };
  }
};
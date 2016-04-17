'use strict';

var map = require('lodash').map;
var add = require('distributedlife-sat').vector.add;
var scale = require('distributedlife-sat').vector.scale;

function p(id, path) {
  return 'players:' + id + '.' + path;
}

module.exports = {
  type: 'OnPhysicsFrame',
  deps: ['Config'],
  func: function Amazing (config) {
    return function (delta, state) {
      return map(state.unwrap('players'), function (player) {
        var position = player.hammerwatch.avatar.position;
        var velocity = player.hammerwatch.avatar.velocity;
        var speed = config().hammerwatch.avatar.speed;

        var newPosition = add(position, scale(velocity, speed * delta));

        return [
          p(player.id, 'hammerwatch.avatar.position'), newPosition
        ];
      });
    };
  }
};
'use strict';

module.exports = {
  type: 'PlayerStateSeed',
  deps: ['Config'],
  func: function Hammerwatch (config) {
    return function seedPlayerState (playerId) {
      return {
        hammerwatch: {
          avatar: {
            position: {x: 50, y: 50},
            velocity: {x: 0, y: 0}
          }
        }
      };
    };
  }
};
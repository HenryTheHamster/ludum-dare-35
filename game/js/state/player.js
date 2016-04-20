'use strict';

module.exports = {
  type: 'PlayerStateSeed',
  deps: ['Config'],
  func: function Hammerwatch (config) {
    return function seedPlayerState () {
      return {
        hammerwatch: {
          avatar: {
            position: {x: 250, y: 250 },
            velocity: {x: 0, y: 0},
            direction: 'north'
          }
        }
      };
    };
  }
};
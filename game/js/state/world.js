'use strict';


module.exports = {
  type: 'StateSeed',
  deps: 'Config',
  func: function Hammerwatch () {
    var player = {
      position: {
        x: 0,
        y: 0
      }
    };
    return {
      hammerwatch: {
        player: player
      }
    };
  }
};
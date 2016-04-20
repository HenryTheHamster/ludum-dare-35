'use strict';

var PIXI = require('pixi.js');
require('../utils/animatedSprite');

module.exports = {
  type: 'OnClientReady',
  deps: ['Config', 'StateTracker', 'DefinePlugin', '$'],
  func: function View (config, tracker, define, $) {

    function velocityToDirection (velocity) {
      var a, b;
      if(velocity.y < 0) {
        a = 'north';
      } else if(velocity.y > 0) {
        a = 'south';
      } else {
        a = '';
      }
      if(velocity.x < 0) {
        b = 'west';
      } else if(velocity.x > 0) {
        b = 'east';
      } else {
        b = '';
      }
      return a + b;
    }

    function getTextures(start, finish) {
      var textures = [];
      for(var i = start; i <= finish; i++) {
        var val = i < 10 ? '0' + i : i;
        textures.push(PIXI.Texture.fromFrame(val + '.png'));
      }
      return textures;
    }

    var avatars = {};
    function addAvatar (id, player, stage) {
      avatars[id] = {
        animations: {},
        avatar: new PIXI.Container()
      };

      var sequences = {
        south: getTextures(1, 4),
        north: getTextures(5, 8),
        southeast: getTextures(9, 12),
        southwest: getTextures(13, 16),
        west: getTextures(17, 20),
        east: getTextures(21, 24),
        northwest: getTextures(25, 28),
        northeast: getTextures(29, 32)
      };

      Object.keys(sequences).forEach(function(key) {
        avatars[id].animations[key] = new PIXI.extras.MovieClip(sequences[key]); 
        avatars[id].animations[key].animationSpeed = 0.15;
        avatars[id].avatar.addChild(avatars[id].animations[key]);
        avatars[id].animations[key].play();
        avatars[id].animations[key].visible = false;
      });
      avatars[id].animations.south.visible = true;
      // avatars[id].animations.south.loop = false;
      avatars[id].avatar.position.x = player.hammerwatch.avatar.position.x;
      avatars[id].avatar.position.y = player.hammerwatch.avatar.position.y;
      avatars[id].avatar.scale.x = 3.0;
      avatars[id].avatar.scale.y = 3.0;

      stage.addChild(avatars[id].avatar);
    }

    function changeDirection (id, player) {
      var direction = velocityToDirection(player.hammerwatch.avatar.velocity);
      if(direction !== '') {
        console.log(direction);
        Object.keys(avatars[id].animations).forEach(function(key) {
          avatars[id].animations[key].loop = true;
          avatars[id].animations[key].play();
          avatars[id].animations[key].visible = false;
        });
        avatars[id].animations[direction].visible = true;
      } else {
        Object.keys(avatars[id].animations).forEach(function(key) {
          avatars[id].animations[key].loop = false;
        });
      }
    }

    //Screen Stuff, pull out
    function worldIsSmallerThenScreen(worldDimensions, screenDimensions) {
      return (worldDimensions.width < screenDimensions.usableWidth ||
          worldDimensions.height < screenDimensions.usableHeight);
    }

    function worldIsLargerThanScreen(worldDimensions, screenDimensions) {
      return !worldIsSmallerThenScreen(worldDimensions, screenDimensions);
    }

    function calculateOffset (worldDimensions, screenDimensions) {
      if (worldIsSmallerThenScreen(worldDimensions, screenDimensions)) {
        return {
          x: (screenDimensions.usableWidth - worldDimensions.width) / 2,
          y: (screenDimensions.usableHeight - worldDimensions.height) / 2
        };
      } else {
        return { x: 0, y: 0 };
      }
    }

    function scaleWorld (dims) {
      if (worldIsLargerThanScreen(config().hammerwatch.world, dims)) {
        var ratio = Math.min(
          dims.screenWidth/config().hammerwatch.world.width,
          dims.screenHeight/config().hammerwatch.world.height
        );

        return {
          x: ratio,
          y: ratio
        };
      } else {
        return {
          x: 1.0,
          y: 1.0
        };
      }
    }

    var stage;
    var offset;
    var scale;
    return function setup (dims, playerId) {
      // $()('#overlay').append(overlay());

      stage = new PIXI.Container();
      var renderer = PIXI.autoDetectRenderer(dims.usableWidth, dims.usableHeight);
      $()('#' + config().client.element).append(renderer.view);

      offset = calculateOffset(config().hammerwatch.world, dims);
      stage.position.x = offset.x;
      stage.position.y = offset.y;
      scale = scaleWorld(dims);
      stage.scale.x = scale.x;
      stage.scale.y = scale.y;
      PIXI.loader
        .add('/game/assets/pirate_queen.json')
        .load(function() {
          tracker().onElementAdded('players', addAvatar, [stage]);
          tracker().onElementChanged('players', changeDirection);
          // tracker().onChangeOf(`players:${playerId}.hammerwatch.avatar.velocity`, changeDirection, [playerId]);
        });
      // stage.addChild(addAvatar());


      define()('OnRenderFrame', function OnRenderFrame () {
        return function renderScene () {
          renderer.render(stage);
        };
      });
    };

  }
};
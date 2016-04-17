'use strict';

var PIXI = require('pixi.js');

module.exports = {
  type: 'OnClientReady',
  deps: ['Config', 'StateTracker', 'DefinePlugin', '$'],
  func: function View (config, tracker, define, $) {

    // function drawBackground () {
    //   var shape = new PIXI.Graphics();
    //   //MOVE colours into a supported feature:
    //   //var colours = require('ensemblejs/colours')
    //   //var colors = require('ensemblejs/colors')
    //   //shape.beginFill(colours.board);
    //   //The colours are picked up from a colours.json file (probably automatically filtered by modes)
    //   shape.beginFill(0xFF0000);
    //   shape.drawRect(0, 0, 520, 520);
    //   shape.zIndex = 10000;

    //   return shape;
    // }

    function createAvatar () {
      var sprite = new PIXI.Sprite.fromImage('/game/assets/saruman.gif');
      return sprite;
    }

    var avatars = {};
    function addAvatar (id, player, stage) {
      avatars[id] = createAvatar();
      avatars[id].position.x = player.hammerwatch.avatar.position.x;
      avatars[id].position.y = player.hammerwatch.avatar.position.y;

      stage.addChild(avatars[id]);
    }

    function moveAvatar (id, player) {
      console.log('move avatar!!!');
      // avatars[id].position.set(player.hammerwatch.avatar.position.x, player.hammerwatch.avatar.position.y);
      avatars[id].position.x = player.hammerwatch.avatar.position.x;
      avatars[id].position.y = player.hammerwatch.avatar.position.y;
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
    return function setup (dims) {
      // $()('#overlay').append(overlay());

      stage = new PIXI.Container();
      var renderer = PIXI.autoDetectRenderer(dims.usableWidth, dims.usableHeight);
      $()('#' + config().client.element).append(renderer.view);

      offset = calculateOffset(config().hammerwatch.world, dims);
      stage.position.x = offset.x;
      stage.position.y = offset.y;
      scale = scaleWorld(dims);
      console.log(scale);
      stage.scale.x = scale.x;
      stage.scale.y = scale.y;

      // stage.addChild(addAvatar());

      tracker().onElementAdded('players', addAvatar, [stage]);
      tracker().onElementChanged('players', moveAvatar);

      define()('OnRenderFrame', function OnRenderFrame () {
        return function renderScene () {
          renderer.render(stage);
        };
      });
    };

  }
};
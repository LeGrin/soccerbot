//
// Aggresive strategy "run-and-kick"- all players run to ball and kick it if possible to any direction
//
'use strict';

function getPlayerMove(data) {
  // TODO : IMPLEMENT THE BETTER STRATEGY FOR YOUR BOT
  var currentPlayer = data.yourTeam.players[data.playerIndex];
  var sixthPartOfFieldWidth = data.settings.field.width / 6 ;
  var playerZoneStartX = sixthPartOfFieldWidth;  
  var ball = data.ball;

  var ballStop = getBallStats(ball, data.settings);
  var isBallClose =  (getDistance(currentPlayer, ballStop) <= ball.settings.radius*2+15);
  var isNearBall =  (getDistance(currentPlayer, ballStop) <= ball.settings.radius*2+100);
  var attackDirection = getDirectionTo(currentPlayer, ballStop)*1.18;    
  if( isBallClose && ball.x < currentPlayer.x)
  {
    var zonePoint = {
      x: ballStop.x,
      y: ballStop.y + (ballStop.y < currentPlayer.y ? 50: -50 )
    };
    attackDirection = getDirectionTo(currentPlayer, zonePoint);
  }
  if (data.playerIndex === 1) {
    var zonePoint = {
      x: (isNearBall && currentPlayer.x < data.settings.field.width/2 ? ballStop.x : playerZoneStartX),
      y: ballStop.y + (isBallClose ? 0 : Math.random() * 30) + (ballStop.x < currentPlayer.x ? (ballStop.y < currentPlayer.y ? 70: -70 ) : 0)
    };
    attackDirection = getDirectionTo(currentPlayer, zonePoint);
  } 
  return {
    direction: attackDirection,
    velocity: currentPlayer.velocity + data.settings.player.maxVelocityIncrement
  };
}

function getDistance(point1, point2) {
  var distance = Math.hypot(point1.x-point2.x, point1.y - point2.y);
  return distance;
}

function getBallStats(ball, gameSettings) {
  var stopTime = getStopTime(ball);
  var stopDistance = ball.velocity * stopTime
    - ball.settings.moveDeceleration * (stopTime + 1) * stopTime / 2;

  var x = ball.x + stopDistance * Math.cos(ball.direction);
  var y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));

  // check the reflection from field side
  if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;

  return { stopTime, stopDistance, x, y };
}

function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getStopTime(ball) {
  return ball.velocity / ball.settings.moveDeceleration;
}

onmessage = (e) => postMessage(getPlayerMove(e.data));
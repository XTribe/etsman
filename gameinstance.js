var Player = require('./player.js').Player,
    etsman = require('./etsman.js')

var GameInstance = function(joinMessage) {
  	this.instanceId = joinMessage.instanceId;
  	this.experimentId = joinMessage.experiment.id;
  	this.created = joinMessage.created;
  	this.started='';
  	this.ended='';
  	this.aborted='';
  	this.players = new Array();
}

GameInstance.prototype.addPlayer = function(readyMsg) {
	var player = new Player(readyMsg);
	this.players=etsman._.concat(this.players,player);
}
GameInstance.prototype.removePlayer = function(leaveMsg) {
	etsman._.remove(this.players, { clientId: leaveMsg.clientId });
}
GameInstance.prototype.setStarted = function() {
	this.started=etsman.currentTimestamp();
}
GameInstance.prototype.setEnded = function() {
	this.ended=etsman.currentTimestamp();
}
GameInstance.prototype.setAborted = function(message) {
  this.aborted=etsman.currentTimestamp();
}

exports.GameInstance = GameInstance;

/*
Join message example
 {
        "sender": "system",
        "topic": "join",
        "instanceId": 29851,
        "experiment": {
                "id": 268,
                "town": {
                        "name": "Rome",
                        "lat": 41.8905198,
                        "lng": 12.4942486,
                        "rad": 0
                }
        },

*/
/* Instance message example
{
	"sender": "system",
	"topic": "instance",
	"instanceId": 29820,
	"experiment": {
		"id": 268,
		"town": {
			"name": "Rome",
			"lat": 41.8905198,
			"lng": 12.4942486,
			"rad": 0
		}
	},
	"params": {}
}
*/
var etsman = require('./etsman.js')

var Player = function(readyMessage) {
  	this.clientId = readyMessage.clientId;
  	if (readyMessage.params) {
  		if (readyMessage.params.data) {
			this.created = readyMessage.params.data.created;
			this.timezone = readyMessage.params.data.timezone;
			this.language = readyMessage.params.data.language;
			this.birth_date = readyMessage.params.data.birth_date;
			this.spoken_languages = readyMessage.params.data.spoken_languages;
			this.sex = readyMessage.params.data.sex;
			this.education = readyMessage.params.data.education;
			this.country = readyMessage.params.data.country;
			this.instances_started = readyMessage.params.data.instances_started;
			this.perc_instances_ended = readyMessage.params.data.perc_instances_ended;
			this.isAnonymous = readyMessage.params.data.isAnonymous;
		}
  	}
  	this.readyTimestamp=etsman.currentTimestamp();
}

exports.Player = Player;
/* Ready message Example with Userdata sending
{
	"clientId": "5742db8c77f86",
	"userId": 0,
	"instanceId": 29820,
	"experiment": {
		"id": "268",
		"town": {
			"name": "Rome",
			"lat": 41.8905198,
			"lng": 12.4942486,
			"rad": 0
		}
	},
	"sender": "system",
	"topic": "ready",
	"params": {
		"data": {
			"created": "",
			"timezone": "",
			"language": "",
			"birth_date": "",
			"spoken_languages": "",
			"sex": "",
			"education": "None",
			"country": "",
			"instances_started": "",
			"perc_instances_ended": "",
			"isAnonymous": true
		}
	}
} 

no userdata sending
 {
        "clientId": "624ee240bae81",
        "userId": "d48d902cb5a99808834d2c48a65e20e8",
        "instanceId": 29838,
        "experiment": {
                "id": "268",
                "town": {
                        "name": "Rome",
                        "lat": 41.8905198,
                        "lng": 12.4942486,
                        "rad": 0
                }
        },
        "sender": "system",
        "topic": "ready"
*/
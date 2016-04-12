var express = require('express'), 
	bodyParser = require('body-parser'), 
	fs = require('fs'), 
	_ = require('lodash'), 
	async = require('async'), 
	cors = require('cors'), 
	app = express(),
    xlogger = require('etsmonitor')(),
    console = process.console;

app.use(cors());
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json());

// ------- DEFAULT SETTINGS - Do not modify these values. Use your own options object passing it to startManager function
var options = {
	port : 9000,				//Your manager will be listening on this port E.g.: http://localhost:9000 (or http://yourServerAddress:9000)
	onClientMessage : null,
	onPing : null,
	onInstance : null,
	onJoin : null,
	onLeave : null,
	onReady : null,
	onOver : null,
	onDrop : null,
	onAbort : null,
	onEnd : null,
	onError : null,
	monitor : {					//Monitor displays all the chain of messages exchanged between Xtribe, your manager and your clients to let you understand what is going on and to debug your code
		enabled : false,		//Enable/disable monitor, it will be available by default on this link: http://localhost:9000/monitor (or http://yourServerAddress:yourPort/monitor)
		customLink : 'monitor'	//You can customize the link to: http://localhost:9000/myMonitor (or http://yourServerAddress:yourPort/myMonitor)
		//userName : 'monitor',
		//password : 'abcd1234' // TODO implement passw e user
	},
	debugSender : {						//Send messages directly to your manager to debug it
		enabled : false, 				//Enable/disable debug sender, it will be available by default on this link: http://localhost:9000/monitor (or http://yourServerAddress:yourPort/debugSender)
		customLink : 'debugSender' 	    //You can customize the link to: http://localhost:9000/mySender (or http://yourServerAddress:yourPort/mySender)
	}
};
// ------- //

exports.startManager = function(opt) {
	var defaultOptions = options;
	options = _.merge({}, defaultOptions, opt);

	logToMonitor("" + new Date());
	logToMonitor("+--------------------------------------+");
	logToMonitor("|        Manager is starting...        |");
	logToMonitor("+--------------------------------------+");

	app.post('/', function(request, response) {
		if (!request.body || !request.body.message) {
			logToMonitor("empty post");
			response.json({});
			return;
		}
		var message = JSON.parse(request.body.message);
		if (!message || !message.topic) {
			logToMonitor("empty message");
			response.json({});
			return;
		}
		
	    message.instanceId = parseInt(message.instanceId || -1, 10);
	    
	    logToMonitor("Message arrived", message);
	    
	    var messageCopy = _.extend({}, message);

		var callback = function(err, outMessage) {
			outMessage = outMessage || {};
			if (err) {
				if (err.userError) {
					outMessage.topic = "usererror";
					outMessage.params = err.userError;
				} else if (err.topic) {
					outMessage.topic = err.topic;
				} else {				
					logToMonitor(err.stack || err);
					outMessage.topic = "error";
					outMessage.params = err.trace || err;	
				}
			}	
			sendClientResponse(message, outMessage, response);
		};

		if (message.sender == 'system') {
			var acceptedTopics = {
				'ping' : options.onPing, 
				'instance' : options.onInstance,
				'join' : options.onJoin,
				'leave' : options.onLeave,
				'ready' : options.onReady,
				'over' : options.onOver,
				'drop' : options.onDrop,
				'abort' : options.onAbort,  
				'end' : options.onEnd, 
				'error' : options.onError 
			};
			
			if (_.isFunction(acceptedTopics[message.topic])) {
				try {
					acceptedTopics[message.topic](messageCopy, callback);	
				} catch (err) {
					callback(err);
				}
			} else {
				logToMonitor("No handler defined for system topic " + message.topic);
				response.json({});
			}
			
		} else {
			
			if (_.isFunction(options.onClientMessage)) {
				try {
					options.onClientMessage(messageCopy, callback);
				} catch (err) {
					callback(err);
				}
			} else {
				logToMonitor("No handler defined for client messages");
				response.json({});
			}
			
		}
		//response.end();
	});
	
	app.listen(options.port);
	logToMonitor("Server listening on port " + options.port);

	// Starts Debug Sender
	if (options.debugSender.enabled) {
		app.use("/"+options.debugSender.customLink,express.static(__dirname+'/debugSender'));
	}

	// Starts Monitor
	if (options.monitor.enabled){
		//app.use(xlogger.express.logger()); // to send all express messages to log
		app.use("/"+options.monitor.customLink, xlogger.webPanel());
	}
}

// message: original message arrived to the manager
// outMessage: reply sent by manager
function sendClientResponse(message, outMessage, response) {
	if (_.isString(outMessage))
		outMessage = {topic : outMessage};
	else if (!_.isObject(outMessage))
		outMessage = {};
		
	var out = {};	

	// TOPIC CORRECTION (just not to be punitive with someone forgetting to add topic to a reply)
	// If manager message has no topic and original message WAS NOT a system one, set the topic to a default
	if (!outMessage.topic && message.sender != 'system') {
		logToMonitor("Warning: Message topic is empty!");
		outMessage.topic = "noTopicFound";
	}
	// If manager message has no topic and original message WAS a system one, set the topic to the original one
	if (!outMessage.topic && message.sender == 'system') {
		outMessage.topic = message.topic;
	};
	
	// Enrich the reply with client and instance data and merge possible params
	if (!isEmpty(outMessage)) {
		outMessage.instanceId = message.instanceId;
		outMessage.clientId = message.clientId;
		
		out = _.merge({
	            recipient:      'client',
	            broadcast:      false,
	            includeSelf:    true,
	            params:         {}
	        }, outMessage);
	}

    response.json(out);    
	logToMonitor("Sent reply", out);
}

function logToMonitor() {
	if (!options.monitor.enabled){
		for (var i = 0; i < arguments.length; i++) {
			if (_.isFunction(arguments[i]))
				continue;

			if (_.isObject(arguments[i]))
				console.info(prettyJson(arguments[i]));
			else
				console.info(arguments[i]);
		}
	}else{
		for (var i = 0; i < arguments.length; i++) {
			if (_.isFunction(arguments[i]))
				continue;

			if (_.isObject(arguments[i]))
				console.log(prettyJson(arguments[i]));
			else
				console.log(arguments[i]);
		}
	}
}

function tryWaterfall(functions, callback_waterfall) {
	var newArr = [];
	_.forEach(functions, function(funct) {
		var newFunct = function() {
			try {
				funct.apply(null, arguments);
			} catch (er) {
				if (er.userError || er.topic) {
					return callback_waterfall.apply(null, [er]);
				}
				logToMonitor("tryWaterfall catch: %s", er.stack || er);
				logToMonitor("in function: %s", funct);
				logToMonitor("with arguments: %j", arguments);
				callback_waterfall.apply(null, [er]);
			}
		};
		newArr.push(newFunct);
	});
	async.waterfall(newArr, callback_waterfall);

}

function userError(err) {
	throw {
		userError : err
	};
}

function nothingFound() {
	throw {
		topic : "nothingfound"
	};
}

function exitIfEmpty(obj) {
	if (isEmpty(obj))
		nothingFound();
}

function exitIfNull(obj) {
	if (obj == null)
		nothingFound();
}

function errIfEmpty(obj) {
	if (isEmpty(obj))
		throw "empty object";
}

function errIfNull(obj) {
	if (obj == null)
		throw "null object";
}

function isEmpty(obj) {
	if (obj == null)
		return true;
	if (obj.length > 0)
		return false;
	if (obj.length === 0)
		return true;

	for (var key in obj)
		if (obj.hasOwnProperty(key))
			return false;

	return true;
}

function prettyJson(obj) {
	return JSON.stringify(obj, null, "\t");
}

exports.logToMonitor = logToMonitor;
exports.tryWaterfall = tryWaterfall;
exports.userError = userError;
exports.nothingFound = nothingFound;
exports.exitIfEmpty = exitIfEmpty;
exports.exitIfNull = exitIfNull;
exports.errIfEmpty = errIfEmpty;
exports.errIfNull = errIfNull;
exports.isEmpty = isEmpty;
exports.prettyJson = prettyJson;
exports._ = _;
exports.async = async;
var express = require('express'),
	  bodyParser  = require('body-parser'),
    fs = require('fs'),
    app = express();

exports.startManager = function(port,manageSystemMessage,manageExperimentMessage,monitorEnabled) {
  // Optional parameter: default set to false
  if (typeof monitorEnabled === 'undefined') { monitorEnabled = false; }

  console.info(""+new Date());
  console.info("+--------------------------------------+");
  console.info("|        Manager is starting...        |");
  console.info("+--------------------------------------+");

  
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.post('/', function(request, response) {
    var message = JSON.parse(request.body.message);
    if (message)
      if (message.sender == 'system'){
      	if(monitorEnabled) logToMonitor(response,message);
        manageSystemMessage(response, message);
      }else{
      	if(monitorEnabled) logToMonitor(response,message);
        manageExperimentMessage(response, message);
      }
    response.end();
  });

  app.listen(port);
  console.info("Server listening on port " + port);
}

function logToMonitor(response,message) {
  //console.log('Coming Soon!');
}
module.exports.logToMonitor = logToMonitor;
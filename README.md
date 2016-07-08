#Xtribe Manager API

Welcome to Xtribe Games Manager API! This library can be included in your own Xtribe Game Manager or in a brand new one. It provides a set of useful tools to enhance creating experiments experience. If you already wrote a node.js manager for your game jump to [Include Manager API in your project](#includeapi) section, otherwise follow our [Quick Start](#quickstart) guide. Please refer to [Manager API](#managerapi) section for details about utilities provided by this library.

Feel free to propose corrections, changes or to request feature that you would find useful.
<a name="quickstart"><a/>
#Quick Start
- Make sure to have a recent version of [node.js](https://nodejs.org/) installed.
- Download the [Xtribe Games Manager Framework](https://github.com/XTribe/xtribe_games_manager_framework/archive/master.zip) from our [Github project](https://github.com/XTribe/xtribe_games_manager_framework).
- Unzip the file.
- Open a command-line terminal and change directory to the 'master' directory you just unzipped or copy files in a directory of your choice and change to it.
- Run this command
`npm install && cd node_modules/etsman/ && npm install && cd ../..` 
to install required libraries. This will create a 'node_modules' directory, containing Xtribe Manager Library (etsman) and the libraries it depends on.
- Run `nodejs index.js` to run your manager.
- Visit **http://localhost:9000/** on your browser to check if it is running. Please notice that Xtribe needs to reach your manager so start it on a server that is someway reachable, that is having an url address or a fixed ip (e.g.:http://yourServerAddressOrIp:9000/). This is the Manager URI to provide to Xtribe while publishing the game.
- Modify **index.js** for customizations.
- Check out **examples** directory and take a look to code examples to get started about building your own manager.
<a name="includeapi"><a/>
#Include Manager API in your project
If you already have developed a manager in node.js and you want to use our Xtribe Manager API, install it is very easy.

In your manager directory run 

`npm install etsman` 

and do not forget to include it in your main js file 

`var etsman = require('etsman');`.
Please refer to [Manager API](#managerapi) section for details about utilities available.
<a name="managerapi"><a/>
#Manager API

You can use any of these methods, exported by the library, for your own use. Remember to check out **examples** directory and take a look to code examples.

N.B: Your manager will be listening on the URL 

`http://yourServerAddressOrIp:yourPort/`

In the following documentation, we'll assume 'yourServerAddressOrIp' equal to 'localhost' and port to '9000', just for simplicity sake. Use your own server address and port for your manager!

<a name="managerapi"><a/>
#How to use examples with my game interface on Xtribe?
Did you already create your game and user interface on Xtribe, didn't you? Check out our [tutorial](http://xtribe.eu/node/64#XTribe_tutorial:_your_first_game) to create your first game on our platform. Follow ['Publishing the game'](http://xtribe.eu/node/64#Publishing_the_game) and ['User Interface'](http://xtribe.eu/node/64#User_interface) paragraphs instructions. It's easy and quick.

The example managers provided, run as standalone application as you start them:

`nodejs example_name.js`

Every example starts on port 9000+example number (e.g.: 9001 for example 1, 9002 for example 2), so, if you start one of them on your server, it will be running on an url like:

`http://yourServerAddressOrIp:9001`

Copy this url and paste it in 'Manager URI' field in the settings of your game. Now, play your game to see the manager in action. 

Please notice that Xtribe needs to reach your manager so start it on a server that is someway reachable, that is having an url address or a fixed ip (e.g.:http://yourServerAddressOrIp:yourPort/). 

#Utilities
`startManager(options)`

Launch your manager, listening to Xtribe messages. Accepts parameters by the optional object 'options', that can contain several custom settings. Any parameter, not explicitly set, will be resolved with default ones.

- port (default '9000'): your manager will be listening on this port. E.g.: http://localhost:9000
- monitor.enabled (default 'false'): true or false to enable/disable the Debug Monitor. Debug Monitor displays all the chain of messages exchanged between Xtribe, your manager and your clients to let you understand what is going on and to debug your code. Monitor is available by default on this link: http://localhost:9000/monitor
- monitor.customLink (default 'monitor'): you can customize the link to be http://localhost:9000/myMonitor
- monitor.verbose (default 'false'): true or false to enable verbose mode to log more debug informations. It will log all messages exchanged between system, manager and clients.
- debugSender.enabled (default 'false'): true or false to enable/disable the Debug Sender. Debug Sender allows you to send messages directly to your manager to debug it. Debug Sender is available by default on this link: http://localhost:9000/debugSender.
- debugSender.customLink (default 'monitor'): you can customize the link to be http://localhost:9000/mySender
- onClientMessage, onPing, onInstance, onJoin, onLeave, onReady, onOver, onDrop, onAbort, onEnd, onError: handlers for the various kind of system/experiment messages. All of the handler functions must receive two parameters: the incoming message and a function to be called on completion.

`GAMEDATA (global variable)`

The global variable GAMEDATA contains data about your game instances, in JSON format, and gets filled in real-time from the moment the manager is started to the moment it is stopped. GAMEDATA contain these data for each instance of the game:

- instanceId: id of the current instance of the game
- experimentId: id of the current game
- created/started/ended/aborted: when the game is created,started,ended or aborted, a timestamp of that event is added in this field. Please refer to ['System Message'](http://xtribe.eu/it/page/xtribe-documentation#System_messages) section in Xtribe documentation, for details about the occurring of these events.
- players: players data are added (or removed) during Join phase as players 'join' (or 'leave') the game. At 'ready' time, data are updated and enriched, if the option 'Enable user data sending' is enabled in your game. For each player, these data are displayed:
    
    - clientId: identifies univocally a player, 
    - readyTimestamp: timestamp of the moment the player started to play 
    - player data: eventually delivered by Xtribe, along with the ready message, if you enabled, in your game settings, the option 'Enable user data sending'. Please refer to ['Messages in detail - Ready'](http://xtribe.eu/node/64#messagesindetail) section in Xtribe documentation, for details about these data, and to ['Advanced Options'](http://xtribe.eu/it/page/xtribe-documentation#Advanced_options) section for enabling this setting in your game.

You can access these data by the GAMEDATA variable directly, or using the method getInstanceData(instanceId).

`getInstanceData(instanceId)`

Returns data about the instance identified by the instanceId passed as parameter. Remember that the instanceId of a specific istance of your game is passed as part of almost any Xtribe message received and sent by your manager and client, during that instance lifetime.

`logToMonitor(obj)`

Logs to the Debug Monitor, directly from your manager.

`prettyJson(obj)`

Format an object in a readable JSON format.

`userError(errorString)`

Stops execution and sends back a user error

`nothingFound()` 

Stops execution and sends back a 'nothingfound' error

`exitIfEmpty(obj)` 

Stops execution and sends back a 'nothingfound' error if the object is empty

`exitIfNull(obj)` 

Stops execution and sends back a 'nothingfound' error if the object is strictly null

`errIfEmpty(obj)` 

Stops execution and sends back an 'empty object' error if the object is empty

`errIfNull(obj)`

Stops execution and sends back an 'null object' error if the object is strictly null

`isEmpty(obj)`

Checks if an object is empty (returns true or false)

`tryWaterfall(functions, callback)`

Utility function similar to async.waterfall, with exception handling. Runs the tasks array of functions in series, each passing their results to the next in the array. However, if any of the tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the error. (See [Async](https://github.com/caolan/async)) This useful library is included in etsman and exported as etsman.async, so you can use for example etsman.async.each(arr, iteratee, [callback])

`intersectSafe(a, b, count_empty_as_full)`

Calculate intersection between two array a and b leaving them untouched, and returns the resulting array. If count_empty_as_full is set to true, the intersection of a filled array with an empty array returns the filled.

`currentTimestamp()`

Return the current timestamp in Unix Time format (number of milliseconds elapsed since 1 January 1970 00:00:00 UTC). (See [Unix Time](https://en.wikipedia.org/wiki/Unix_time))

`connectToMysqlDb(host,database,user,password)`

Connects to a mysql database. Accepts as parameters:
host: The hostname of the database you are connecting to ('localhost' if on your machine)
database: Name of the database to use for this connection
user: The MySQL user to authenticate as
password: The password of that MySQL user

<a name="extlib"><a/>
#External libraries exported
Our library export some useful third-party libraries, so you don't have to include them again.

`async`
The useful library async ([Async](https://github.com/caolan/async)) which provides straight-forward, powerful functions for working with asynchronous JavaScript)

`_`
The library lodash ([Lodash](https://lodash.com/)). Learn how to take the hassle out of working with arrays, numbers, objects and strings) 
<a name="references"><a/>
#References
[Join the Experimental Tribe!](http://xtribe.eu/)

[Xtribe Documentation](http://xtribe.eu/en/page/xtribe-devdoc)

[Xtribe Games Manager Framework](https://github.com/XTribe/xtribe_games_manager_framework)

[Xtribe Games Manager API](https://github.com/XTribe/xtribe_manager_api)

[Contact us](mailto:xtribe.eu@gmail.com)
<a name="troubleshooting"><a/>
#Troubleshooting
- *When I run my manager, this error is shown.*
 
   `Error: Cannot find module 'etsman'`

  - You have not installed Xtribe Manager API. Run `npm install` in the directory where you stored downloaded files.
  
- *When I install libraries with `npm install`, my node_modules directory is nearly empty or it is not created.*
  - Check your permissions. If you are on Linux or Mac OS you may need to run npm install as superuser.

- *When I install libraries with `npm install`, my node_modules directory is nearly empty and this error is shown:*

    `npm ERR! Error: shasum check failed`

  - Check your node is updated to the most recent version. Optionally, reset your npm

     `npm set registry http://registry.npmjs.org/` 
     
     `npm cache clean`
 

#Xtribe Manager API

Welcome to Xtribe Games Manager API! This library can be included in your own Xtribe Game Manager. It provides a set of useful tools to enhance creating experiments experience. Please refer to **Manager API** section for details.

Feel free to propose corrections, changes or to request feature that you would find useful. 

#Include Manager API in your project
If you already have developed a manager in node.js and you want to use our Xtribe Manager API, install it is very easy.

In your manager directory run 

`npm install etsman` 

and do not forget to include it in your main js file 

`var etsman = require('etsman');`.
Please refer to Manager API section for details about tools made available by Xtribe Manager Library.

#References
[Join the Experimental Tribe!](http://xtribe.eu/)

[Xtribe documentation](http://xtribe.eu/en/page/xtribe-devdoc)

[Contact us](mailto:xtribe.eu@gmail.com)

#Manager API

`startManager(port,manageSystemMessage,manageExperimentMessage,monitorEnabled)`

Launch a standard manager, listening to Xtribe messages. Accepts these parameter:

- port: your manager will be listening on this port
- system message callback: callback for managing system messages
- experiment message callback: callback for managing your own experiment messages
- (optional) debug mode: true or false to run it in debug mode

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


 

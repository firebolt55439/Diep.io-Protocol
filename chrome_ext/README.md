# About
This Chrome extension allows for snooping on two-way traffic between the diep.io client
(written in Javascript, primarily in `d.js`) and the server (written in an unknown language, 
most likely node.js or C/C++). 

All packets/protocol information so far has been discovered by using this extension.

# Set-Up Instructions

![Load Unpacked Ext.](http://i.imgur.com/irmGkCb.png)

To set up this extension and modify it, go to chrome://extensions and click "Load
Unpacked Extension", then navigate to this directory (you will need to clone this
project first).

# How To Use
The file "modifier.js" contains a framework for handling communications to/from
the server. 

To intercept packets sent by the client, modify the function `handleSendData(data)`. If you
would like to modify the packet sent to the server, simply modify `data`, which is then
returned by the function and sent to the server.

Similarly, to intercept/modify packets sent by the server, use the function `handleRecvData(event, proxiedRecv)`.

The `event` variable is simply the Javascript WebSocket event; to access the data, use `event.data`. 
For altering the data, all you have to do is modify `event.data`. 

If you would like to send the client custom packets or such in order to observe the client's response, etc., use `proxiedRecv.call(this, customEvent)`.

# Handling Code Changes

![Chrome Extension](http://i.imgur.com/jBaDsHM.png)

Remember to navigate to `chrome://extensions` and click "Reload" after any changes to the code!
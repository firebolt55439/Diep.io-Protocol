# Chrome Extension
This chrome extension allows for snooping on two-way traffic between the diep.io client
(Javascript) and the server (unknown language, most likely node.js or C/C++). All
packets have been discovered by snooping with this extension.

# Set-Up Instructions
To set up this extension and modify it, go to chrome://extensions and click "Load
Unpacked Extension", then navigate to this directory (you will need to clone this
project first).

# How To Use
The file "modifier.js" contains a framework for handling communications to/from
the server.
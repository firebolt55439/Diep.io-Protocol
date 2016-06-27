# About
This project aims to decipher the protocol diep.io uses to communicate, in hopes of 
creating our own server eventually or doing interesting things with the game. 

# Getting Started
**All the protocol information discovered so far is contained in the [Wiki](https://github.com/firebolt55439/Diep.io-Protocol/wiki).**

First, read up on the game protocol in the wiki "Protocol" page in order to familiarize 
yourself with the basics of diep.io communication. Everything we have learned so far
is stored in the wiki, and reading it will allow you a headstart in developing your own
server, understanding the game protocol, or doing anything you wish with the game.

Then, you can start using the provided Chrome extension to start reading and modifying 
the game packets yourself. The extension is stored in the `chrome_ext` directory, and
a `README` is included in that directory. There's even a wiki page if you want more
information.

# Installing the Extension
To set up the provided extension, first clone this project and save it on your computer. Next, 
go to `chrome://extensions` and click "Load Unpacked Extension". Then, navigate to its 
directory and enable the extension. If you modify any of the code, go to `chrome://extensions` 
and click "Reload".

# Using the Extension
The file "modifier.js" contains a framework for handling communications to/from
the server. 

To intercept packets sent by the client, modify the function `handleSendData(data)`. If you
would like to modify the packet sent to the server, simply modify `data`, which is then
returned by the function and sent to the server.

Similarly, to intercept/modify packets sent by the server, use the function `handleRecvData(event, proxiedRecv)`.

The `event` variable is simply the Javascript WebSocket event; to access the data, use `event.data`. 
For altering the data, all you have to do is modify `event.data`. 

If you would like to send the client custom packets or such in order to observe the client's response, etc., use `proxiedRecv.call(this, customEvent)`.

Remember to navigate to `chrome://extensions` and click "Reload" after any changes to the code!

# How To Contribute
**If you discover anything interesting or have anything you can contribute, please consider
submitting a pull request.** 

Forking this project and submitting a pull request will allow you to contribute changes to code.

# Contributors
**Team Members**: [firebolt55439](https://github.com/firebolt55439), [hxxr](https://github.com/hxxr), [FlorianCassayre](https://github.com/FlorianCassayre)

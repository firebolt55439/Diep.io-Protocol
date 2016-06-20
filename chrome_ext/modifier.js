function injectScript(source){
	// Create a new script element.
    var elem = document.createElement("script");
    elem.type = "text/javascript";
    elem.innerHTML = source;
    
    // Inject it into the DOM.
    document.documentElement.appendChild(elem);
}

injectScript("("+(function() {
	var proxiedSend = window.WebSocket.prototype.send;
	var upgradeParams = [
		"Health Regen",
		"Max Health",
		"Body Damage",
		"Bullet Speed",
		"Bullet Penetration",
		"Bullet Damage",
		"Reload",
		"Movement Speed"
	];
	var tankParams = {
		2:"Twin",
		12:"Sniper",
		14:"Machine Gun",
		16:"Flank Guard",
		22:"Overseer",
		18:"Tri-Angle",
		20:"Destroyer",
		50:"Hybrid",
		40:"Gunner",
		38:"Hunter",
		30:"Assassin",
		24:"Overlord"
	};
	function handleSendData(data) {
		// This function is called whenever a packet is sent from the client
		// to the server.
		// Note that all packets appear to be arrays of 8-bit signed integers (Int8Array in JS)
		// and have varying array lengths depending on the function of the packet.
		// len == 1: keep-alive/heartbeat (always 5)
		// len == 6: mouse started moving
		// len == 7: mouse location update?
		// len == 8 or 9: at spawn screen
		// len == 10: in game or observing
		if(data.length > 1){
			// WASD = 2 4 8 16 (3 5 9 17 w/ bullet)
			// 6 18
			// 12 24
			// All packets that do upgrades are of size 2, however the server checks to
			// make sure that you have the necessary "points" to upgrade.
			if(data.length == 2 && data[0] == 3){
				// This will re-send the upgrade packet 3 times, but the server
				// is smart and double-checks if you have enough points.
				//console.log("Attempting to apply update 3 times.");
				//for(var i = 0; i < 3; i++) proxiedSend.call(this, data);
				var param = upgradeParams[(14 - data[1]) / 2];
				console.log("Detected '" + param + "' parameter upgrade with packet:");
				console.log(data);
			}
			if(data.length == 2 && data[0] == 4){
				//Tank upgrades (sniper, twin, etc...)
				var param = tankParams[data[1]];
				console.log("Detected '" + param + "' parameter tank upgrade with packet:")
				console.log(data);
			}
			if(data[data.length - 1] > 0 && data.length > 5){
				var last = data[data.length - 1];
				var bulletOpcodes = [1, 3, 5, 7, 9, 13, 17, 19, 25];
				if(bulletOpcodes.indexOf(last) !== -1){
					console.log("Bullet (" + data.length + ")!");
					if(last > 1){
						console.log("Firing bullet while moving:");
						--last;
					}
					//console.log("Attempting amplification...");
					//for(var i = 0; i < 5; i++) proxiedSend.call(this, data);
				}
				if(last == 2){
					console.log("W (North)");
				} else if(last == 4){
					console.log("A (West)");
				} else if(last == 8){
					console.log("S (South)");
				} else if(last == 16){
					console.log("D (East)");
				} else if(last == 6 || last == 12 || last == 18 || last == 24){
					var str = "";
					if(last == 6) str = "NW";
					else if(last == 12) str = "SW";
					else if(last == 18) str = "NE";
					else if(last == 24) str = "SE";
					console.log("Diagonal Movement Direction: " + str);
				} else if(last > 1){
					console.log("Unknown opcode with last number: " + last);
					//data[data.length - 1] = 0;
				}
				//console.log(data);
			}
			if(data.length == 6){
				console.log("Cursor started moving.");
			} else if(data.length == 7){
				console.log("Cursor moving.");
			}
			/*
			if(data.length > 8 && data.length < 11 && data[1] != -116 && data[1] != -118){
				console.log("Interesting:");
				console.log(data);
			}
			*/
			if(data[0] == 2){
				// A name packet.
				var arr = data.slice(1, data.length - 1);
				var name = String.fromCharCode.apply(null, arr);
				console.log("Intercepted in-game name: " + name);
			}
			/*
			// Uncomment to dump all packets.
			console.log("Game Data:");
			console.log(data);
			//console.log(Object.prototype.toString.call(data)); // uncomment to dump type of packet (most likely Int8Array)
			*/
		}
		return data;
	}
	function handleRecvData(event, proxiedRecv) {
		// This function is called whenever the server sends data to the client.
		// I have not had much luck deciphering server --> client communication due
		// to extensive obfuscation of the client JS code for handling data
		// sent by the server.
		/*
		if(inst.events !== undefined){
			inst.events.push([1, event.data, event.data.length]);
		}
		*/
		if(event.data.byteLength > 1){
			/*
			// Uncomment as needed to dump packets for inspection.
			console.log("Recv Length: " + event.data.byteLength);
			//console.log(intArrayToString(new Uint32Array(event.data)));
			//console.log("Received data:");
			var dv = new DataView(event.data);
			console.log(dv.getUint8(0) + " " + dv.getUint8(1));
			console.log(dv.getUint16(2));
			//console.log(String.fromCharCode.apply(null, new Uint8Array(event.data)));
			*/
		}
		return event;
	}
	// Locate websocket classes.
	console.log("WS:");
	console.log(window.WebSocket.prototype);
	//console.log(m.sockets);
	
	// Snoop on outgoing websocket traffic.
	
	var wsInstances = new Set();
	window.WebSocket.prototype.send = function(data) {
		// Note: Data is given as an Int8Array JS object.
		if(!wsInstances.has(this)){
			console.log("New WebSocket Used:");
			console.log(this);
			wsInstances.add(this);
			
			// Snoop on incoming websocket traffic.
			var inst = this;
			var proxiedRecv = inst.onmessage;
			this.onmessage = function(event) {
				event = handleRecvData.call(this, event, proxiedRecv);
				return proxiedRecv.call(this, event);
			};
			console.log("Successfully hijacked onmessage handler.");
		}
		data = handleSendData.call(this, data);
		return proxiedSend.call(this, data);
	};

	
}).toString()+")(" + JSON.stringify([/*arguments*/]) + ")");
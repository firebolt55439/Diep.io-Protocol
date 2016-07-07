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
	
	// Upgrades
	var upgradeParams = [
		"Movement Speed",
		"Reload",
		"Bullet Damage",
		"Bullet Penetration",
		"Bullet Speed",
		"Body Damage",
		"Max Health",
		"Health Regen"
	];
	
	// Tanks
	var tankParams = {
		// Twin
		2:"Twin",
		6:"Triple Shot",
		4:"Triplet",
		28:"Penta Shot",
		
		// Flank Guard
		16:"Flank Guard",
		18:"Tri-Angle",
		46:"Booster",
		48:"Fighter",
		
		// Machine Gun
		14:"Machine Gun",
		20:"Destroyer",
		50:"Hybrid",
		40:"Gunner",
		
		// Sniper
		12:"Sniper",
		22:"Overseer",
		38:"Hunter",
		30:"Assassin",
		24:"Overlord",
		34:"Necromancer",
		42:"Stalker",
		44:"Ranger",
		52:"Manager",
		
		// Twin/Flank Guard
		8:"Quad Tank",
		26:"Twin Flank",
		10:"Octo Tank",
		36:"Triple Twin"
	};
	
	// Server uptime, in ticks
	var uptime = 0;
	
	function decodeUTF8(bytes) {
		// From: https://gist.github.com/pascaldekloe/62546103a1576803dade9269ccf76330
		var s = '';
		var i = 0;
		while (i < bytes.length) {
			var c = bytes[i++];
			if (c > 127) {
				if (c > 191 && c < 224) {
					if (i >= bytes.length) throw 'UTF-8 decode: incomplete 2-byte sequence';
					c = (c & 31) << 6 | bytes[i] & 63;
				} else if (c > 223 && c < 240) {
					if (i + 1 >= bytes.length) throw 'UTF-8 decode: incomplete 3-byte sequence';
					c = (c & 15) << 12 | (bytes[i] & 63) << 6 | bytes[++i] & 63;
				} else if (c > 239 && c < 248) {
					if (i+2 >= bytes.length) throw 'UTF-8 decode: incomplete 4-byte sequence';
					c = (c & 7) << 18 | (bytes[i] & 63) << 12 | (bytes[++i] & 63) << 6 | bytes[++i] & 63;
				} else throw 'UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1);
				++i;
			}

			if (c <= 0xffff) s += String.fromCharCode(c);
			else if (c <= 0x10ffff) {
				c -= 0x10000;
				s += String.fromCharCode(c >> 10 | 0xd800)
				s += String.fromCharCode(c & 0x3FF | 0xdc00)
			} else throw 'UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach';
		}
		return s;
	}
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
		var SILENCE_DEBUGGING_INFO = false; // whether to silence debugging information or not
		if(data.length > 1){
			// WASD = 2 4 8 16 (3 5 9 17 w/ bullet)
			// 6 18
			// 12 24
			// All packets that do upgrades are of size 2, however the server checks to
			// make sure that you have the necessary "points" to upgrade.
			/*
			if(data.length == 9 || data.length == 10){
				//console.log(data[2]); 
				SILENCE_DEBUGGING_INFO = true;
				var buf = new ArrayBuffer(8);
				var int8View = new Int8Array(buf);
				for(var i = 1; i < 9; i++) int8View[i - 1] = data[i];
				var view = new DataView(buf);
				//var str = "";
				//for(var i = 0; i < 8-3; i++) str += view.getFloat32(i, true) + " ";
				//console.log(str);
				console.log(view.getFloat64(0, true));
				//data[1] = -118;
				//data[8] = 1;
			}
			*/
			if(data.length == 2){
				if(data[0] == 3){
					// This will re-send the upgrade packet 3 times, but the server
					// is smart and double-checks if you have enough points.
					//console.log("Attempting to apply update 3 times.");
					//for(var i = 0; i < 3; i++) proxiedSend.call(this, data);
					var param = upgradeParams[data[1] / 2];
					console.log("Detected '" + param + "' parameter upgrade with packet:");
					console.log(data);
				} else if(data[0] == 4){
					// Tank upgrades (sniper, twin, etc.)
					var param = tankParams[data[1]];
					console.log("Detected tank upgrade to '" + param + "' with packet:")
					console.log(data);
				}
			}
			var outStr = "";
			if(data[data.length - 1] > 0 && data.length > 5 && data.length < 11){
				var last = data[data.length - 1];
				var bulletOpcodes = [1, 3, 5, 7, 9, 13, 17, 19, 25];
				if(bulletOpcodes.indexOf(last) !== -1){
					outStr += "Bullet!\n";
					if(last > 1){
						outStr += "Firing bullet while moving: ";
						--last;
					}
				}
				if(last == 2){
					outStr += "W (North)";
				} else if(last == 4){
					outStr += "A (West)";
				} else if(last == 8){
					outStr += "S (South)";
				} else if(last == 16){
					outStr += "D (East)";
				} else if(last == 6 || last == 12 || last == 18 || last == 24){
					var str = "";
					if(last == 6) str = "NW";
					else if(last == 12) str = "SW";
					else if(last == 18) str = "NE";
					else if(last == 24) str = "SE";
					outStr += "Diagonal (" + str + ")";
				} else if(last > 1){
					outStr += "Unknown opcode with last number: " + last;
					//data[data.length - 1] = 0;
				}
				//console.log(data);
			}
			if(data.length == 6){
				outStr += "Cursor started moving.";
			} else if(data.length == 7){
				outStr += "Cursor moving.";
			}
			if(!SILENCE_DEBUGGING_INFO && outStr.length > 0){
				console.log(outStr);
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
				var name = decodeUTF8(arr);
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
	var lastLeaderboardNames = [];
	function handleRecvData(event, proxiedRecv) {
		var dv = new DataView(event.data);
		// This function is called whenever the server sends data to the client.
		// I have not had much luck deciphering server --> client communication due
		// to extensive obfuscation of the client JS code for handling data
		// sent by the server.
		/*
		if(inst.events !== undefined){
			inst.events.push([1, event.data, event.data.length]);
		}
		*/
		
		// Get server uptime, in ticks (A tick is 40 milliseconds)
		if(dv.getUint8(0) == 0){
			/*
			for(var d = [], i = 0; i <= 8; i++){
				d.push(dv.getUint8(i));
			}
			console.log(d)
			*/
			if((dv.getUint8(3) == 0 && dv.getUint8(5) == 1 && dv.getUint8(8) == 0)||
			(dv.getUint8(3) == 1 && (dv.getUint8(4) == 0 || dv.getUint8(4) == 1 || dv.getUint8(4) == 2))){
				// For Domination and Mothership
				var a = dv.getUint8(1) - 128;
				var b = dv.getUint8(2) * 128;
				uptime = a + b;
				//console.log(uptime)
			}else{
				// For FFA and Team DM
				var a = dv.getUint8(1) - 128;
				var b = (dv.getUint8(2) - 128) * 128;
				var c = dv.getUint8(3) * 16384
				uptime = a + b + c;
				//console.log(uptime);
			}
		}
		
		if(event.data.byteLength > 15){
			/*
			// Uncomment as needed to dump packets for inspection.
			console.log("Recv Length: " + event.data.byteLength);
			//console.log("Received data:");
			var dv = new DataView(event.data);
			console.log(dv.getUint8(0) + " " + dv.getUint8(1));
			console.log(dv.getUint16(2));
			//console.log(String.fromCharCode.apply(null, new Uint8Array(event.data)));
			*/
			/*
			var dv = new DataView(event.data);
			console.log("Server sent client ArrayBuffer of size: " + event.data.byteLength);
			console.log(dv.getUint8(0) + " " + dv.getUint8(1));
			*/
			
			//console.log("Packet type: " + dv.getUint8(0));
			var str = "";
			/*
			VM4587:170 Packet type: 0
			VM4587:173 162 91 0 13 1 0 0 0 11 76 
			VM4587:170 Packet type: 0
			VM4587:173 162 91 0 13 1 0 0 0 11 211 
			VM4587:170 Packet type: 0
			VM4587:173 162 91 0 13 1 0 0 0 11 230 
			VM4587:170 Packet type: 0
			VM4587:173 162 91 0 13 1 0 0 0 11 145 
			VM4587:170 Packet type: 0
			VM4587:173 162 91 0 13 1 0 0 0 11 222 
			VM4587:170 Packet type: 0
			VM4587:173 162 91 0 13 1 0 0 0 11 215 
			VM4587:170 Packet type: 0
			VM4587:173 162 91 0 13 1 0 0 0 11 132 
			VM4587:170 Packet type: 0
			VM4587:173 162 91 0 13 1 0 0 0 11 236
			*/
			var base_type = dv.getUint8(0);
			var isLeaderboardPacket = function(dv, len) {
				if(base_type != 0 && base_type != 2) return [false];
				//var packet_opcode1 = dv.getUint32(7), packet_opcode2 = dv.getUint32(11);
				var foundOff = -1;
				for(var at_off = 7; (at_off + 48) < len; at_off++){
					if(dv.getUint32(at_off) == 11 && dv.getUint8(at_off + 8) == 17){
						foundOff = at_off;
						break;
					}
				}
				if(foundOff !== -1){
					if(base_type == 2) console.log("TYPE TWO!");
					return [true, foundOff + 9];
				} else {
					return [false];
				}
			}(dv, event.data.byteLength);
			if(isLeaderboardPacket[0]){
				// These types of packets are sent only when the leaderboard "violently"
				// changes (e.g. someone dies on the leaderboard, rather than simply
				// move up/down in score)
				console.log("Potential leaderboard changed packet (at off. " + isLeaderboardPacket[1] + "):");
				/*
				if(packet_opcode1 != 11){
					console.log("EXPERIMENTAL!!!");
					str = "";
					for(var i = 0; i < event.data.byteLength; i++){
						str += dv.getUint8(i) + " ";
						if(i > 0 && (i % 8 == 0)) str += "\n";
					}
					console.log(str);
				}
				*/
				/*
				console.log(String.fromCharCode.apply(null, new Uint8Array(event.data)));
				*/
				var starting_off = isLeaderboardPacket[1];
				var found_names = 0;
				var names = [];
				for(var i = starting_off; i < event.data.byteLength; i++){
					//console.log("At idx: " + i);
					var start = i;
					for(; i < event.data.byteLength && dv.getUint8(i) !== 0; i++){
						var on = dv.getUint8(i);
						//if(on < 32 || on > '}'.charCodeAt(0)) i = event.data.byteLength; // unprintable ASCII character
					}
					// [start, i)
					var nameArr = new Uint8Array(event.data.slice(start, i));
					//console.log(nameArr);
					//console.log(String.fromCharCode.apply(null, nameArr));
					var name = decodeUTF8(nameArr);
					names.push(name);
					++found_names;
					if(found_names == 10){
						/*
						str = "";
						for(var i = 0; i < event.data.byteLength; i++){
							str += dv.getUint8(i) + " ";
							if(i > 0 && (i % 8 == 0)) str += "\n";
						}
						console.log(str);
						*/
						console.log(names);
						lastLeaderboardNames = names;
						// found last leaderboard string
						var off = 7;
						//i = start;
						start = i;
						i += off;
						if((i + 40) < event.data.byteLength){
							for(var j = i; j <= (start + off + 4*5); j += 4){
								console.log("Leaderboard Score: " + dv.getFloat32(j, /*littleEndian=*/true));
							}
						}
						break;
					}
				}
			}/* else if(lastLeaderboardNames.length > 0){
				var asStr = String.fromCharCode.apply(null, new Uint8Array(event.data));
				var one = false;
				for(var i = 0; i < lastLeaderboardNames.length; i++){
					var on = lastLeaderboardNames[i];
					if(on.length < 2) continue;
					if(asStr.indexOf(on) !== -1){
						one = true;
						console.log("Found '" + on + "' of leaderboard fame in packet of len " + event.data.byteLength + ", type " + base_type);
					}
				}
				if(one){
					str = "";
					for(var i = 0; i < event.data.byteLength; i++){
						str += dv.getUint8(i) + " ";
						if(i > 0 && (i % 8 == 0)) str += "\n";
					}
					console.log(str);
				}
			}*//* else {
				var asStr = String.fromCharCode.apply(null, new Uint8Array(event.data));
				if(asStr.toLowerCase().indexOf("mg") !== -1){
					console.log("MG Packet of len " + event.data.byteLength + ", type " + base_type + ":");
					str = "";
					for(var i = 0; i < event.data.byteLength; i++){
						str += dv.getUint8(i) + " ";
						if(i > 0 && (i % 8 == 0)) str += "\n";
					}
					console.log(str);
				}
			}*/
			/*
			for(var i = 0; i < 10; i++) str += dv.getUint16(2 + 2*i) + " ";
			console.log(str);
			*/
		}
		return event;
	}
	
	// Snoop on outgoing websocket traffic.
	
	var wsInstances = new Set();
	window.WebSocket.prototype.send = function(data) {
		// Note: Data is given as an Int8Array JS object.
		if(!wsInstances.has(this)){
			//console.log("New WebSocket Used:");
			//console.log(this);
			wsInstances.add(this);
			
			// Snoop on incoming websocket traffic.
			var inst = this;
			var proxiedRecv = inst.onmessage;
			this.onmessage = function(event) {
				event = handleRecvData.call(this, event, proxiedRecv);
				return proxiedRecv.call(this, event);
			};
			//console.log("Successfully hijacked onmessage handler.");
		}
		data = handleSendData.call(this, data);
		return proxiedSend.call(this, data);
	};

	
}).toString()+")(" + JSON.stringify([/*arguments*/]) + ")");
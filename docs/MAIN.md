<a name="Main"></a>

## Main ⇐ <code>EventEmitter</code>
The Main Class is the file that you would require to handle everything.

**Kind**: global class
**Extends**: <code>EventEmitter</code>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the server. |
| options.port | <code>Number</code> | The port to use for the growtopia server. |
| options.channels | <code>Number</code> | The amount of channels to use. |
| options.peers | <code>Number</code> | The amount of peers to use. |
| options.bandwith | <code>Object</code> | Options for the bandwith. |
| options.bandwith.incoming | <code>Number</code> | The max amount of incoming bandwith. |
| options.bandwith.outgoing | <code>Number</code> | The max amount of outgoing bandwith. |
| options.location | <code>String</code> | The location of the items.dat file. |
| options.cdn | <code>String</code> | The cdn content to use. |


* [Main](#Main) ⇐ <code>EventEmitter</code>
    * [.version](#Main+version)
    * [.isInitialized](#Main+isInitialized)
    * [.init()](#Main+init) ⇒ <code>undefined</code>
    * [.getModule()](#Main+getModule) ⇒ <code>Object</code>
    * [.GetPacketType(packet)](#Main+GetPacketType) ⇒ <code>Number</code>
    * [.GetMessage(packet)](#Main+GetMessage) ⇒ <code>String</code>
    * [.createPacket(asdf, size)](#Main+createPacket) ⇒ <code>Object</code>
    * [.appendString(packet, str)](#Main+appendString) ⇒ <code>Object</code>
    * [.appendInt(packet, val)](#Main+appendInt) ⇒ <code>Object</code>
    * [.appendIntx(packet, val)](#Main+appendIntx) ⇒ <code>Object</code>
    * [.packetEnd(packet)](#Main+packetEnd) ⇒ <code>Object</code>
    * [.getHash(location)](#Main+getHash) ⇒ <code>Number</code>
    * [.buildItemsDatabase(location)](#Main+buildItemsDatabase) ⇒ <code>Buffer</code>
    * [.sendWorld(peerid, world)](#Main+sendWorld) ⇒ <code>undefined</code>
    * [.generateWorld(name, width, height)](#Main+generateWorld) ⇒ <code>Object</code>
    * [.isInSameWorld(peerid, peerid2)](#Main+isInSameWorld) ⇒ <code>Boolean</code>
    * [.onSpawn(peer, msg)](#Main+onSpawn) ⇒ <code>undefined</code>
    * [.onPeerConnect(peerid)](#Main+onPeerConnect) ⇒ <code>undefined</code>
    * [.sendPlayerLeave(peerid)](#Main+sendPlayerLeave) ⇒ <code>undefined</code>
    * [.GetStructPointerFromTankPacket(packet)](#Main+GetStructPointerFromTankPacket) ⇒ <code>Number</code>
    * [.sendPData(peerid, data)](#Main+sendPData) ⇒ <code>undefined</code>
    * [.packPlayerMoving(data)](#Main+packPlayerMoving) ⇒ <code>Buffer</code>
    * [.unpackPlayerMoving(data)](#Main+unpackPlayerMoving) ⇒ <code>Object</code>
    * ["connect"](#Main+event_connect)
    * ["receive"](#Main+event_receive)

<a name="Main+version"></a>

### main.version
Returns the current version of node-gtps you're running.

**Kind**: instance property of [<code>Main</code>](#Main)
**Read only**: true
<a name="Main+isInitialized"></a>

### main.isInitialized
Returns the value of the private variable "isInitialized"

**Kind**: instance property of [<code>Main</code>](#Main)
**Read only**: true
<a name="Main+init"></a>

### main.init() ⇒ <code>undefined</code>
A modifier to the private variable "isInitialized". This does not initialize enet.

**Kind**: instance method of [<code>Main</code>](#Main)
<a name="Main+getModule"></a>

### main.getModule() ⇒ <code>Object</code>
Returns the value of the private variable "gtps" which is the compiled c++ addon

**Kind**: instance method of [<code>Main</code>](#Main)
<a name="Main+GetPacketType"></a>

### main.GetPacketType(packet) ⇒ <code>Number</code>
Gets the message type from the ArrayBuffer provided by the server.

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>ArrayBuffer</code> | The packet you received. |

<a name="Main+GetMessage"></a>

### main.GetMessage(packet) ⇒ <code>String</code>
Decodes the packet if it was encoded with raw text.

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>ArrayBuffer</code> | The packet you received. |

<a name="Main+createPacket"></a>

### main.createPacket(asdf, size) ⇒ <code>Object</code>
Creates a packet.

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| asdf | <code>String</code> | The header of the packet |
| size | <code>Number</code> | The size to allocate for the buffer/packet. |

<a name="Main+appendString"></a>

### main.appendString(packet, str) ⇒ <code>Object</code>
Appends a String to the packet

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - Packet data

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | Packet data |
| str | <code>String</code> | The string to append |

<a name="Main+appendInt"></a>

### main.appendInt(packet, val) ⇒ <code>Object</code>
Appends an Number to the packet

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - Packet data

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | Packet Data |
| val | <code>Number</code> | The value/number to add |

<a name="Main+appendIntx"></a>

### main.appendIntx(packet, val) ⇒ <code>Object</code>
Same as appendInt, but this uses the byte value of 0x05 after the index

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - packet data.

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | The packet to append to |
| val | <code>Number</code> | The value to append. |

<a name="Main+packetEnd"></a>

### main.packetEnd(packet) ⇒ <code>Object</code>
Adds the last thing to end a packet and to be able to have the correct format.

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - Packet data

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | The packet you created or used append with. |

<a name="Main+getHash"></a>

### main.getHash(location) ⇒ <code>Number</code>
Gets the hash of the items.dat

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| location | <code>String</code> | The location of the items.dat file. |

<a name="Main+buildItemsDatabase"></a>

### main.buildItemsDatabase(location) ⇒ <code>Buffer</code>
Builds the item database

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| location | <code>String</code> | The location of the items.dat file. |

<a name="Main+sendWorld"></a>

### main.sendWorld(peerid, world) ⇒ <code>undefined</code>
Sends a world to load

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer joining |
| world | <code>Object</code> | The world to send |

<a name="Main+generateWorld"></a>

### main.generateWorld(name, width, height) ⇒ <code>Object</code>
Generates a world.

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - World data generated

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of the world to generate |
| width | <code>Number</code> | The width of the world |
| height | <code>Number</code> | The height of the world |

<a name="Main+isInSameWorld"></a>

### main.isInSameWorld(peerid, peerid2) ⇒ <code>Boolean</code>
Checks if two peers are in the same world

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Boolean</code> - If they are in the same world.

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The peer to compare |
| peerid2 | <code>String</code> | The peer to compare with |

<a name="Main+onSpawn"></a>

### main.onSpawn(peer, msg) ⇒ <code>undefined</code>
Sends an onSpawn to a specific peer

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>String</code> | The peer to send data to. |
| msg | <code>String</code> | The packet to send |

<a name="Main+onPeerConnect"></a>

### main.onPeerConnect(peerid) ⇒ <code>undefined</code>
Sends an onSpawn to every other peer in the same world as the given peer

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | Peer that joined |

<a name="Main+sendPlayerLeave"></a>

### main.sendPlayerLeave(peerid) ⇒ <code>undefined</code>
Makes a player leave the world

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer that left |

<a name="Main+GetStructPointerFromTankPacket"></a>

### main.GetStructPointerFromTankPacket(packet) ⇒ <code>Number</code>
Gets the Struct Pointer from the packet

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>ArrayBuffer</code> | Packet from message type 4 |

<a name="Main+sendPData"></a>

### main.sendPData(peerid, data) ⇒ <code>undefined</code>
Sends player data to the server

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| data | <code>Object</code> | The data to send |

<a name="Main+packPlayerMoving"></a>

### main.packPlayerMoving(data) ⇒ <code>Buffer</code>
Creates a buffer that would contain PlayerMoving data

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Buffer</code> - The buffer that has those data

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | PlayerMoving data to add to the buffer |

<a name="Main+unpackPlayerMoving"></a>

### main.unpackPlayerMoving(data) ⇒ <code>Object</code>
Unpacks a PlayerMoving data and convert it to an object

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - The unpacked PlayerMoving data.

| Param | Type | Description |
| --- | --- | --- |
| data | <code>ArrayBuffer</code> | Data received from message type 4 |

<a name="Main+event_connect"></a>

### "connect"
Connect Event

**Kind**: event emitted by [<code>Main</code>](#Main)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer that connected |

<a name="Main+event_receive"></a>

### "receive"
Emitted when you receive data

**Kind**: event emitted by [<code>Main</code>](#Main)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| packet | <code>Map</code> | A map of received packets from the client. |
| peerid | <code>String</code> | The id of the peer that send that packet. |


C:\Users\AJ\Desktop\Growtopia.js>jsdoc2md ./src/Packet.js
<a name="Packet"></a>

## Packet
Methods for sending/using/ packets.

**Kind**: global class

* [Packet](#Packet)
    * [.sendStringPacket(peerid, buffer)](#Packet+sendStringPacket) ⇒ <code>undefined</code>
    * [.log(peerid, message)](#Packet+log) ⇒ <code>undefined</code>
    * [.sendQuit(peerid)](#Packet+sendQuit) ⇒ <code>undefined</code>
    * [.sendPacket(peerid, packet, [length])](#Packet+sendPacket) ⇒ <code>undefined</code>
    * [.sendPacketRaw(peerid, a1, data, size, a4)](#Packet+sendPacketRaw) ⇒ <code>undefined</code>

<a name="Packet+sendStringPacket"></a>

### packet.sendStringPacket(peerid, buffer) ⇒ <code>undefined</code>
Sends strings to peer

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| buffer | <code>String</code> | The string to send |

<a name="Packet+log"></a>

### packet.log(peerid, message) ⇒ <code>undefined</code>
Sends a "OnConsoleMessage" packet to the client

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| message | <code>String</code> | The message to send |

<a name="Packet+sendQuit"></a>

### packet.sendQuit(peerid) ⇒ <code>undefined</code>
Disconnects the peer.

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |

<a name="Packet+sendPacket"></a>

### packet.sendPacket(peerid, packet, [length]) ⇒ <code>undefined</code>
Sends a created packet to the peer

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| packet | <code>Object</code> | The packet to send |
| [length] | <code>Number</code> | OPTIONAL: The length to give, by default it will use the packet's length. |

<a name="Packet+sendPacketRaw"></a>

### packet.sendPacketRaw(peerid, a1, data, size, a4) ⇒ <code>undefined</code>
Sends a raw packet to the client

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| a1 | <code>Number</code> | <Not sure yet> |
| data | <code>Buffer</code> | Data to send |
| size | <code>Number</code> | Size of the data |
| a4 | <code>Number</code> | <Not sure yet> |


C:\Users\AJ\Desktop\Growtopia.js>jsdoc2md ./src/Host.js
<a name="Host"></a>

## Host ⇐ <code>EventEmitter</code>
**Kind**: global class
**Extends**: <code>EventEmitter</code>

* [Host](#Host) ⇐ <code>EventEmitter</code>
    * [.init()](#Host+init) ⇒ <code>Number</code>
    * [.create()](#Host+create) ⇒ <code>undefined</code>
    * [.start()](#Host+start) ⇒ <code>undefined</code>
    * [.checkIfConnected(peer)](#Host+checkIfConnected) ⇒ <code>Boolean</code>

<a name="Host+init"></a>

### host.init() ⇒ <code>Number</code>
Initializes enet.

**Kind**: instance method of [<code>Host</code>](#Host)
<a name="Host+create"></a>

### host.create() ⇒ <code>undefined</code>
Creates the server for the growtopia server.

**Kind**: instance method of [<code>Host</code>](#Host)
<a name="Host+start"></a>

### host.start() ⇒ <code>undefined</code>
Starts the growtopia server

**Kind**: instance method of [<code>Host</code>](#Host)
<a name="Host+checkIfConnected"></a>

### host.checkIfConnected(peer) ⇒ <code>Boolean</code>
Checks if a peer is still connected

**Kind**: instance method of [<code>Host</code>](#Host)
**Returns**: <code>Boolean</code> - Whether or not it is connected or not

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>String</code> | The peer to check if it is connected/disconnected |


C:\Users\AJ\Desktop\Growtopia.js>jsdoc2md ./src/Main.js
<a name="Main"></a>

## Main ⇐ <code>EventEmitter</code>
The Main Class is the file that you would require to handle everything.

**Kind**: global class
**Extends**: <code>EventEmitter</code>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the server. |
| options.port | <code>Number</code> | The port to use for the growtopia server. |
| options.channels | <code>Number</code> | The amount of channels to use. |
| options.peers | <code>Number</code> | The amount of peers to use. |
| options.bandwith | <code>Object</code> | Options for the bandwith. |
| options.bandwith.incoming | <code>Number</code> | The max amount of incoming bandwith. |
| options.bandwith.outgoing | <code>Number</code> | The max amount of outgoing bandwith. |
| options.location | <code>String</code> | The location of the items.dat file. |
| options.cdn | <code>String</code> | The cdn content to use. |


* [Main](#Main) ⇐ <code>EventEmitter</code>
    * [.version](#Main+version)
    * [.isInitialized](#Main+isInitialized)
    * [.init()](#Main+init) ⇒ <code>undefined</code>
    * [.getModule()](#Main+getModule) ⇒ <code>Object</code>
    * [.GetPacketType(packet)](#Main+GetPacketType) ⇒ <code>Number</code>
    * [.GetMessage(packet)](#Main+GetMessage) ⇒ <code>String</code>
    * [.createPacket(asdf, size)](#Main+createPacket) ⇒ <code>Object</code>
    * [.appendString(packet, str)](#Main+appendString) ⇒ <code>Object</code>
    * [.appendInt(packet, val)](#Main+appendInt) ⇒ <code>Object</code>
    * [.appendIntx(packet, val)](#Main+appendIntx) ⇒ <code>Object</code>
    * [.packetEnd(packet)](#Main+packetEnd) ⇒ <code>Object</code>
    * [.getHash(location)](#Main+getHash) ⇒ <code>Number</code>
    * [.buildItemsDatabase(location)](#Main+buildItemsDatabase) ⇒ <code>Buffer</code>
    * [.sendWorld(peerid, world)](#Main+sendWorld) ⇒ <code>undefined</code>
    * [.generateWorld(name, width, height)](#Main+generateWorld) ⇒ <code>Object</code>
    * [.isInSameWorld(peerid, peerid2)](#Main+isInSameWorld) ⇒ <code>Boolean</code>
    * [.onSpawn(peer, msg)](#Main+onSpawn) ⇒ <code>undefined</code>
    * [.onPeerConnect(peerid)](#Main+onPeerConnect) ⇒ <code>undefined</code>
    * [.sendPlayerLeave(peerid)](#Main+sendPlayerLeave) ⇒ <code>undefined</code>
    * [.GetStructPointerFromTankPacket(packet)](#Main+GetStructPointerFromTankPacket) ⇒ <code>Number</code>
    * [.sendPData(peerid, data)](#Main+sendPData) ⇒ <code>undefined</code>
    * [.packPlayerMoving(data)](#Main+packPlayerMoving) ⇒ <code>Buffer</code>
    * [.unpackPlayerMoving(data)](#Main+unpackPlayerMoving) ⇒ <code>Object</code>
    * ["connect"](#Main+event_connect)
    * ["receive"](#Main+event_receive)

<a name="Main+version"></a>

### main.version
Returns the current version of node-gtps you're running.

**Kind**: instance property of [<code>Main</code>](#Main)
**Read only**: true
<a name="Main+isInitialized"></a>

### main.isInitialized
Returns the value of the private variable "isInitialized"

**Kind**: instance property of [<code>Main</code>](#Main)
**Read only**: true
<a name="Main+init"></a>

### main.init() ⇒ <code>undefined</code>
A modifier to the private variable "isInitialized". This does not initialize enet.

**Kind**: instance method of [<code>Main</code>](#Main)
<a name="Main+getModule"></a>

### main.getModule() ⇒ <code>Object</code>
Returns the value of the private variable "gtps" which is the compiled c++ addon

**Kind**: instance method of [<code>Main</code>](#Main)
<a name="Main+GetPacketType"></a>

### main.GetPacketType(packet) ⇒ <code>Number</code>
Gets the message type from the ArrayBuffer provided by the server.

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>ArrayBuffer</code> | The packet you received. |

<a name="Main+GetMessage"></a>

### main.GetMessage(packet) ⇒ <code>String</code>
Decodes the packet if it was encoded with raw text.

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>ArrayBuffer</code> | The packet you received. |

<a name="Main+createPacket"></a>

### main.createPacket(asdf, size) ⇒ <code>Object</code>
Creates a packet.

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| asdf | <code>String</code> | The header of the packet |
| size | <code>Number</code> | The size to allocate for the buffer/packet. |

<a name="Main+appendString"></a>

### main.appendString(packet, str) ⇒ <code>Object</code>
Appends a String to the packet

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - Packet data

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | Packet data |
| str | <code>String</code> | The string to append |

<a name="Main+appendInt"></a>

### main.appendInt(packet, val) ⇒ <code>Object</code>
Appends an Number to the packet

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - Packet data

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | Packet Data |
| val | <code>Number</code> | The value/number to add |

<a name="Main+appendIntx"></a>

### main.appendIntx(packet, val) ⇒ <code>Object</code>
Same as appendInt, but this uses the byte value of 0x05 after the index

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - packet data.

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | The packet to append to |
| val | <code>Number</code> | The value to append. |

<a name="Main+packetEnd"></a>

### main.packetEnd(packet) ⇒ <code>Object</code>
Adds the last thing to end a packet and to be able to have the correct format.

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - Packet data

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | The packet you created or used append with. |

<a name="Main+getHash"></a>

### main.getHash(location) ⇒ <code>Number</code>
Gets the hash of the items.dat

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| location | <code>String</code> | The location of the items.dat file. |

<a name="Main+buildItemsDatabase"></a>

### main.buildItemsDatabase(location) ⇒ <code>Buffer</code>
Builds the item database

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| location | <code>String</code> | The location of the items.dat file. |

<a name="Main+sendWorld"></a>

### main.sendWorld(peerid, world) ⇒ <code>undefined</code>
Sends a world to load

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer joining |
| world | <code>Object</code> | The world to send |

<a name="Main+generateWorld"></a>

### main.generateWorld(name, width, height) ⇒ <code>Object</code>
Generates a world.

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - World data generated

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of the world to generate |
| width | <code>Number</code> | The width of the world |
| height | <code>Number</code> | The height of the world |

<a name="Main+isInSameWorld"></a>

### main.isInSameWorld(peerid, peerid2) ⇒ <code>Boolean</code>
Checks if two peers are in the same world

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Boolean</code> - If they are in the same world.

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The peer to compare |
| peerid2 | <code>String</code> | The peer to compare with |

<a name="Main+onSpawn"></a>

### main.onSpawn(peer, msg) ⇒ <code>undefined</code>
Sends an onSpawn to a specific peer

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>String</code> | The peer to send data to. |
| msg | <code>String</code> | The packet to send |

<a name="Main+onPeerConnect"></a>

### main.onPeerConnect(peerid) ⇒ <code>undefined</code>
Sends an onSpawn to every other peer in the same world as the given peer

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | Peer that joined |

<a name="Main+sendPlayerLeave"></a>

### main.sendPlayerLeave(peerid) ⇒ <code>undefined</code>
Makes a player leave the world

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer that left |

<a name="Main+GetStructPointerFromTankPacket"></a>

### main.GetStructPointerFromTankPacket(packet) ⇒ <code>Number</code>
Gets the Struct Pointer from the packet

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>ArrayBuffer</code> | Packet from message type 4 |

<a name="Main+sendPData"></a>

### main.sendPData(peerid, data) ⇒ <code>undefined</code>
Sends player data to the server

**Kind**: instance method of [<code>Main</code>](#Main)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| data | <code>Object</code> | The data to send |

<a name="Main+packPlayerMoving"></a>

### main.packPlayerMoving(data) ⇒ <code>Buffer</code>
Creates a buffer that would contain PlayerMoving data

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Buffer</code> - The buffer that has those data

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | PlayerMoving data to add to the buffer |

<a name="Main+unpackPlayerMoving"></a>

### main.unpackPlayerMoving(data) ⇒ <code>Object</code>
Unpacks a PlayerMoving data and convert it to an object

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - The unpacked PlayerMoving data.

| Param | Type | Description |
| --- | --- | --- |
| data | <code>ArrayBuffer</code> | Data received from message type 4 |

<a name="Main+event_connect"></a>

### "connect"
Connect Event

**Kind**: event emitted by [<code>Main</code>](#Main)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer that connected |

<a name="Main+event_receive"></a>

### "receive"
Emitted when you receive data

**Kind**: event emitted by [<code>Main</code>](#Main)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| packet | <code>Map</code> | A map of received packets from the client. |
| peerid | <code>String</code> | The id of the peer that send that packet. |
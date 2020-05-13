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
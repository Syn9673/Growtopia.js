<a name="Main"></a>

## Main ⇐ <code>EventEmitter</code>
The Main Class is the file that you would require to handle everything.

**Kind**: global class
**Extends**: <code>EventEmitter</code>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| port | <code>Number</code> | The port to use for the growtopia server. |
| channels | <code>Number</code> | The amount of channels to use. |
| peers | <code>Number</code> | The amount of peers to use. |
| bandwith | <code>Object</code> | Options for the bandwith. |
| bandwith.incoming | <code>Number</code> | The max amount of incoming bandwith. |
| bandwith.outgoing | <code>Number</code> | The max amount of outgoing bandwith. |


* [Main](#Main) ⇐ <code>EventEmitter</code>
    * [.version](#Main+version)
    * [.isInitialized](#Main+isInitialized)
    * [.init()](#Main+init) ⇒ <code>undefined</code>
    * [.getModule()](#Main+getModule) ⇒ <code>Object</code>
    * [.GetPacketType(packet)](#Main+GetPacketType) ⇒ <code>Number</code>
    * [.GetMessage(packet)](#Main+GetMessage) ⇒ <code>String</code>
    * [.createPacket()](#Main+createPacket) ⇒ <code>Buffer</code>
    * [.appendString(packet, str)](#Main+appendString) ⇒ <code>Object</code>

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

### main.createPacket() ⇒ <code>Buffer</code>
Creates a packet.

**Kind**: instance method of [<code>Main</code>](#Main)
<a name="Main+appendString"></a>

### main.appendString(packet, str) ⇒ <code>Object</code>
Appends a String to the packet

**Kind**: instance method of [<code>Main</code>](#Main)
**Returns**: <code>Object</code> - Packet data

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Object</code> | Packet data |
| str | <code>String</code> | The string to append |
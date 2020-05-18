## Classes

<dl>
<dt><a href="#Main">Main</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>The Main Class is the file that you would require to handle everything.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#worlds">worlds</a></dt>
<dd></dd>
<dt><a href="#players">players</a></dt>
<dd></dd>
<dt><a href="#commands">commands</a></dt>
<dd></dd>
<dt><a href="#playersDB">playersDB</a></dt>
<dd></dd>
<dt><a href="#worldsDB">worldsDB</a></dt>
<dd></dd>
<dt><a href="#Packet">Packet</a></dt>
<dd></dd>
<dt><a href="#Host">Host</a></dt>
<dd></dd>
<dt><a href="#actions">actions</a></dt>
<dd></dd>
<dt><a href="#Dialog">Dialog</a></dt>
<dd></dd>
</dl>

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
| options.secretKey | <code>String</code> | The secret key to use for passwords, PLEASE CHANGE THIS |


* [Main](#Main) ⇐ <code>EventEmitter</code>
    * [.version](#Main+version)
    * [.isInitialized](#Main+isInitialized)
    * [.init()](#Main+init) ⇒ <code>undefined</code>
    * [.getModule()](#Main+getModule) ⇒ <code>Object</code>
    * [.GetPacketType(packet)](#Main+GetPacketType) ⇒ <code>Number</code>
    * [.GetMessage(packet)](#Main+GetMessage) ⇒ <code>String</code>
    * [.getHash(location)](#Main+getHash) ⇒ <code>Number</code>
    * [.buildItemsDatabase(location)](#Main+buildItemsDatabase) ⇒ <code>Buffer</code>
    * [.generateWorld(name, width, height)](#Main+generateWorld) ⇒ <code>Object</code>
    * ["connect"](#Main+event_connect)
    * ["receive"](#Main+event_receive)
    * ["disconnect"](#Main+event_disconnect)

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

<a name="Main+event_disconnect"></a>

### "disconnect"
Emitted when a player leaves the game/disconnect

**Kind**: event emitted by [<code>Main</code>](#Main)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer that disconnected. |

<a name="worlds"></a>

## worlds
**Kind**: global variable
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| worlds | <code>Map</code> | The worlds cache |

<a name="players"></a>

## players
**Kind**: global variable
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| players | <code>Map</code> | The players cache |

<a name="commands"></a>

## commands
**Kind**: global variable
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| commands | <code>Map</code> | The commands cache |

<a name="playersDB"></a>

## playersDB
**Kind**: global variable
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| playersDB | <code>Enmap</code> | The players database |

<a name="worldsDB"></a>

## worldsDB
**Kind**: global variable
**Properties**

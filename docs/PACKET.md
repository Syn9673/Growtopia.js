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
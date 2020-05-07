<a name="Packet"></a>

## Packet
Methods for sending/using/ packets.

**Kind**: global class

* [Packet](#Packet)
    * [.sendRawPacket(peerid, buffer)](#Packet+sendRawPacket) ⇒ <code>undefined</code>
    * [.log(peerid, packet, message)](#Packet+log) ⇒ <code>undefined</code>
    * [.sendQuit(peerid)](#Packet+sendQuit) ⇒ <code>undefined</code>

<a name="Packet+sendRawPacket"></a>

### packet.sendRawPacket(peerid, buffer) ⇒ <code>undefined</code>
Sends a raw packet to the server

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| buffer | <code>Buffer</code> | The buffer to send |

<a name="Packet+log"></a>

### packet.log(peerid, packet, message) ⇒ <code>undefined</code>
Sends a "OnConsoleMessage" packet to the client

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| packet | <code>Buffer</code> | The packet to send |
| message | <code>String</code> | The message to send |

<a name="Packet+sendQuit"></a>

### packet.sendQuit(peerid) ⇒ <code>undefined</code>
Disconnects the peer.

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
# GTPS Wrapper
This is a wrapper for the [Growtopia Noob's Private Server](https://github.com/growtopianoobs/growtopiaserver).  
But it uses it's own C++ Code, most structs are from his code, handling of event types can be handled in either the C++ Binding or here.  

## Running
You would have to make a sepearate .js file and copy the example below.  
For the webserver, simply run `node web.js` on a separate terminal/cmd/shell.

## Example
```js
const { Main, Host, Packet } = require('./index.js');
const Server = new Main({
  port: 17091,
  channels: 32,
  peers: 2,
  bandwith: {
    incoming: 0,
    outgoing: 0
  }
});

const HostHandler = new Host(Server);
const PacketHandler = new Packet(Server);

HostHandler.init();
HostHandler.create();

Server.on('connect', (peerid) => console.log(`A client connected with peer ${peerid}`));
Server.on('receive', (packet, peerid) => {
  PacketHandler.log(peerid, "Server by `4_alexander#9673`o. Add me on Discord!", Server.createPacket())
});

HostHandler.start()
```

## Docs
Inside docs folder.
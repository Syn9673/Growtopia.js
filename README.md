# GTPS Wrapper
Growtopia.js is the first ever Growtopia Private Server coded with NodeJS. Inspired by [Growtopia Noob's Private Server](https://github.com/GrowtopiaNoobs/GrowtopiaServer)
This uses it's own C++ Code, handling of event types can be handled in either the C++ Binding or here. Packet creation, send world, generate world, Packet decode is also done on nodejs. Packet sending is done in C++

## Running
You would have to make a sepearate .js file and copy the example below.  
For the webserver, simply run `node web.js` on a separate terminal/cmd/shell.

## Example
```js
const { Main, Host, Packet } = require('./index.js');
const Server = new Main({
  port: 17091, // note: this is the default value, you can not include this if you'd like.
  channels: 32, // note: this is the default value, you can not include this if you'd like.
  peers: 2, // note: this is the default value, you can not include this if you'd like.
  bandwith: {
    incoming: 0, // note: this is the default value, you can not include this if you'd like.
    outgoing: 0 // note: this is the default value, you can not include this if you'd like.
  },
  cdn: '0098/CDNContent61/cache/' // note: this is the default value, you can not include this if you'd like.
});

const HostHandler = new Host(Server);
const PacketHandler = new Packet(Server);

HostHandler.init();
HostHandler.create();

Server.on('connect', (peerid) => console.log(`A client connected with peer ${peerid}`));
Server.on('receive', (packet, peerid) => {
  // do stuff when you receive data from the server
});

HostHandler.start()
```

## Docs
Inside docs folder.
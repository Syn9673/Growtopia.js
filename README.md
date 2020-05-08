# GTPS Wrapper
This is a wrapper for the [Growtopia Noob's Private Server](https://github.com/growtopianoobs/growtopiaserver).  
But it uses it's own C++ Code, some structs are from his code, handling of event types can be handled in either the C++ Binding or here. While packet encryption is mostly done here as well, the only encryption for the packets which is in the C++ Binding is the `packetEnd` function, but i'm looking forward to move it to nodejs.

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
  cdn: '0098/CDNContent59/cache/' // note: this is the default value, you can not include this if you'd like.
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
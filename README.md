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
  location: 'items.dat', // note this is the default value, you can not include this if you'd like.
  cdn: '0098/CDNContent61/cache/', // note: this is the default value, you can not include this if you'd like.
  commandsDir: `${__dirname}/src/commands` // note: this is the default value, you can not include this if you'd like
});

const HostHandler = new Host(Server);
const PacketHandler = new Packet(Server);

HostHandler.init();
HostHandler.create();

Server.on('connect', (peerid) => console.log(`A client connected with peer ${peerid}`));
Server.on('receive', (packet, peerid) => {
  // do stuff when you receive data from the server
});
Server.on('disconnect', (peerid) => console.log(`A client disconnected with peer ${peerid}`));

HostHandler.start()
```

## Creating Commands
Here in Growtopia.js, you can easily create commands. You would need to create a file for it inside the given commands directory, or by default `src/commands`. It must have the .js extension. After creating you would need to make an object that would contain the properties: `name` and the function `run`. The `run` function has 3 parameters, `main` (the one that has access to most/all methods.), `arguments` (an array of strings which are the given arguments for the command, or none if a player didn't give), `peerid` (the id of the peer that ran the command, can be used to send data to) Here is an example of a command  
```js
module.exports = {
  name: 'hello',
  run: function(main, arguments, peerid) {
    let packet = main.packetEnd(
      main.appendString(
        main.appendString(
          main.createPacket(),
          "OnConsoleMessage"),
        `Hello ${main.players.get(peerid).displayName}`));
  }
};
```
As you can see, based on this example, it would say `Hello yourNameHere`. That's how you can create your commands. No need to handle how they are loaded as it is handled upon start. When modifying a command, you would need to restart the server. This will be fixed, but not soon as it's not in demand. Another thing you might've noticed is the lack of permission system. We havn't added that feature since the User Accounts feature would be needed and it is still in development. Expect this in the near feature.

## Docs
Inside docs folder.
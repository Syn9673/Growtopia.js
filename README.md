# GTPS Wrapper
Growtopia.js is the first ever Growtopia Private Server coded with NodeJS. Inspired by [Growtopia Noob's Private Server](https://github.com/GrowtopiaNoobs/GrowtopiaServer)
This uses it's own C++ Code. Packet creation, send world, generate world, packet decoding is done on node.js. Packet sending is done in C++ though.

## Running
You would have to make a sepearate .js file and copy the example below.  
Install the required packages first by doing `npm install`.  
For the webserver, simply run `node web.js` on a separate terminal/cmd/shell, or run your own! (if you've already set it up)  
You would also need `enmap`, you can simply run `npm install enmap` to install it. If you receive an error about `node-gyp`, kindly do `npm install node-gyp -g`. If it still won't install, kindly ask support on [our discord](https://discord.gg/3NrVX8s)

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
  commandsDir: `${__dirname}/src/commands`, // note: this is the default value, you can not include this if you'd like
  secretKey: 'growtopia.js' // The secret key to use to encrypt passwords, PLEASE CHANGE THIS AND DO NOT TELL ANYONE YOU DON'T TRUST
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
In Growtopia.js, you can easily create commands. You would need to create a file for it inside the given commands directory, or by default `src/commands`. It must have the .js extension. After creating you would need to make an object that would contain the properties: `name` and the function `run`. The `run` function has 3 parameters, `main` (the one that has access to most/all methods), `arguments` (an array of strings which are the given arguments for the command, or none if a player didn't give), `peerid` (the id of the peer that ran the command, can be used to send data to). `p` would be the `PacketCreator` which you can create packets with. Here is an example of a command:
```js
module.exports = {
  name: 'hello',
  requiredPerms: 0,
  run: function(main, arguments, peerid, p) {
    p.create()
      .string('OnConsoleMessage')
      .string(`Hello ${main.players.get(peerid).displayName}`)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct(); // this is needed so that other features that will use the same PacketCreator instance can create/recreate packets.
  }
};
```

Based on this example, it would say `Hello yourNameHere`. Required perms is not needed as they can be omitted since the default is undefined. You can check the `Constants.Permissions` object to see what are the available permissions. That's how you can create your commands. No need to handle how they are loaded as it is handled upon start. When modifying a command, you would need to restart the server. This will be fixed, but not soon as it's not very important.

## Docs
Our docs are automaticlly made. They're in /docs.

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
  PacketHandler.log(peerid, "Server by `4_alexander#9673`o. Add me on Discord!")
});

HostHandler.start()
const Packet = require('./Packet');

module.exports = function(main, packet, peerid) {
  const PacketHandler = new Packet(main);
  const type = PacketHandler.GetStructPointerFromTankPacket(packet);
  const data = PacketHandler.unpackPlayerMoving(packet);

  switch(type) {
    case 0: {
      let player = main.players.get(peerid);
      player.x = data.x;
      player.y = data.y;

      player.temp.MovementCount++;
      if (player.temp.MovementCount < 2) {
        let peers = [...main.players.keys()]

        for (let i = 0; i < peers.length; i++) {
          if (!main.Host.checkIfConnected(peers[i]))
            continue;

          if (peerid === peers[i])
            continue;

          if (!main.Host.isInSameWorld(peerid, peers[i]))
            continue;
            
          main.Packet.sendState(peers[i]);
        }
      }
      
      main.players.set(peerid, player);
      PacketHandler.sendPData(peerid, data);
      break;
    }

    case 18: {
      PacketHandler.sendPData(peerid, data);
      break;
    }

    case 7: {
      PacketHandler.sendPlayerLeave(peerid);
      PacketHandler.requestWorldSelect(peerid);
      break;
    }
  }
};
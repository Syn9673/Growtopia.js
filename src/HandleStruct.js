const Packet = require('./Packet');
const wings = [156, 350, 362, 678, 736, 818, 1166, 1206, 1460, 1550, 1574, 1672, 1674, 1738, 1780, 1784, 1824, 1934, 1936, 1938, 1970, 2158, 2160, 2162, 2164, 2166, 2168, 2254, 2256, 2258, 2260, 2262, 2264, 2438, 2538, 2642, 2722, 2776, 2930, 2932, 2982, 3104, 3112, 3114, 3120, 3134, 3134, 3144, 3308, 3442, 3512, 3858, 4184, 4412, 4414, 4534, 4628, 4970, 4972, 4986, 5020, 5322, 5738, 5754, 6004, 6144, 6284, 6334, 6694, 6758, 6818, 6842, 7104, 7350, 7582, 9394];

module.exports = function(main, packet, peerid, p) {
  const PacketHandler = new Packet(main);
  const type = PacketHandler.GetStructPointerFromTankPacket(packet);
  const data = PacketHandler.unpackPlayerMoving(packet);

  switch(type) {
    case 0: {
      let player = main.players.get(peerid);
      player.x = Math.floor(data.x);
      player.y = Math.floor(data.y);

      player.temp.MovementCount++;
      if (player.temp.MovementCount < 2) {
        let peers = [...main.players.keys()]

        for (let i = 0; i < peers.length; i++) {
          if (!main.Host.checkIfConnected(peers[i]))
            continue;

          if (wings.includes(player.clothes.back)) {
            player.addState('canDoubleJump')
            return main.Packet.sendState(peerid);
          }

          if (peerid === peers[i])
            continue;

          if (!main.Host.isInSameWorld(peerid, peers[i]))
            continue;

          main.Packet.sendState(peers[i]);
        }
      }

      main.players.set(peerid, player);
      PacketHandler.sendPData(peerid, data);

      if (!player.hasClothesUpdated) {
        player.hasClothesUpdated = true;
        main.players.set(peerid, player);
        main.Packet.updateAllClothes(peerid);
      }
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

    case 10: {
      let item = main.getItems().get(data.plantingTree);
      let player = main.players.get(peerid);

      switch(item.clothingType) {
        case 0: {
          player.clothes.hair = data.plantingTree;
          break;
        }

        case 1: {
          player.clothes.shirt = data.plantingTree;
          break;
        }

        case 2: {
          player.clothes.pants = data.plantingTree;
          break;
        }

        case 3: {
          player.clothes.feet = data.plantingTree;
          break;
        }

        case 4: {
          player.clothes.face = data.plantingTree;
          break;
        }

        case 5: {
          player.clothes.hand = data.plantingTree;
          break;
        }

        case 6: {
          if (wings.includes(data.plantingTree))
            player.addState('canDoubleJump')

          main.Packet.sendState(peerid);

          player.clothes.back = data.plantingTree;
          break;
        }

        case 7: {
          player.clothes.mask = data.plantingTree;
          break;
        }

        case 8: {
          player.clothes.necklace = data.plantingTree;
          break;
        }
      }

      main.players.set(peerid, player);
      main.Packet.sendClothes(peerid);
      break;
    }

    case 3: {
      let x = data.punchX;
      let y = data.punchY;

      let player = main.players.get(peerid);
      let world = main.worlds.get(player.currentWorld);

      if (data.plantingTree === 18) {
        let block = world.items[x + (y * world.width)].foreground;

        if (block === 6) return main.Packet.sendNothing(peerid, x, y);

        if (block === 8) {
          p.create()
            .string('OnTalkBubble')
            .intx(player.netID)
            .string('It\'s too strong to break')
            .intx(0)
            .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
        }

        world.items[x + (y * world.width)].foreground = 0;
      } else {
        world.items[x + (y * world.width)].foreground = data.plantingTree;
      }

      main.worlds.set(player.currentWorld, world);

      for (let peer of [...main.players.keys()]) {
        if (!main.Host.checkIfConnected(peer))
          continue;

        if (main.Host.isInSameWorld(peerid, peer)) {
          main.Packet.sendPacketRaw(peer, 4, main.Packet.packPlayerMoving(data), 56, 0);
        }
      }
      break;
    }
  }
};

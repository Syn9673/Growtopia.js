const PlayerMoving = require('./structs/PlayerMoving');
const PacketCreator = require('./PacketCreator');
const Constants = require('./structs/Constants');
let p = new PacketCreator();

/**
 * @class Methods for sending/using/ packets.
 */

class Packet {
  #main;
  constructor(main) {
    this.#main = main;
    this.Host = new (require('./Host'))(this.#main);
  }

  /**
   * Sends strings to peer
   * @param {String} peerid The id of the peer
   * @param {String} buffer The string to send
   * @returns {undefined}
   */

  sendStringPacket(peerid, string) {
    return this.#main.getModule().Packets.send(peerid, string);
  }


  /**
   * Disconnects the peer.
   * @param {String} peerid The id of the peer
   * @returns {undefined}
   */

  sendQuit(peerid, willDelete) {
    /*if (willDelete === undefined)
      willDelete = true;

    if (willDelete === true)
      this.#main.players.delete(peerid);*/

    return this.#main.getModule().Packets.quit(peerid);
  }

  /**
   * Sends a created packet to the peer
   * @param {String} peerid The id of the peer
   * @param {Buffer} packet The packet to send
   * @param {Number} [length] OPTIONAL: The length to give, by default it will use the packet's length.
   * @returns {undefined}
   */

  sendPacket(peerid, packet, length) {
    return this.#main.getModule().Packets.sendPacket(peerid, packet, length || packet.length);
  }

  /**
   * Sends a raw packet to the client
   * @param {String} peerid The id of the peer
   * @param {Number} a1 <Not sure yet>
   * @param {Buffer} data Data to send
   * @param {Number} size Size of the data
   * @param {Number} a4 <Not sure yet>
   * @returns {undefined}
   */

  sendPacketRaw(peerid, a1, data, size, a4) {
    return this.#main.getModule().Packets.sendPacketRaw(peerid, a1, data, size, a4);
  }

  /**
   * Decodes the packet to get the packetType/Struct of the packet for packet type 4.
   * @param {ArrayBuffer} packet
   * @returns {Number} The packet type of the decoded packet.
   */

  GetStructPointerFromTankPacket(packet) {
    let p = Buffer.from(packet);

    let result;

    if (p.length >= 0x3C)
      result = p[4];

    return result;
  }

  /**
   * Creates a packet that would contain data from the PlayerMoving class.
   * @param {PlayerMoving} data PlayerMoving data
   * @returns {Buffer} PlayerMoving packet
   */

  packPlayerMoving(data) {
    let packet = Buffer.alloc(56);
    let offsets = {
      packetType: 0,
      netID: 4,
      characterState: 12,
      plantingTree: 20,
      x: 24,
      y: 28,
      xSpeed: 32,
      ySpeed: 36,
      punchX: 44,
      punchY: 48
    };

    for (let packetOffset of Object.keys(offsets)) {
      if (packetOffset === 'x' || packetOffset === 'y' || packetOffset === 'xSpeed' || packetOffset === 'ySpeed') {
        packet.writeFloatLE(data[packetOffset], offsets[packetOffset], 4);
      } else {
        packet.writeIntLE(data[packetOffset], offsets[packetOffset], 4);
      }
    }

    return packet;
  }

  /**
   * Decodes the packet from packt type 4 and converts it to a PlayerMoving data
   * @param {ArrayBuffer} data The packet to get data from
   * @returns {PlayerMoving}
   */

  unpackPlayerMoving(data) {
    let packet = Buffer.from(data);
    let dataStruct = new PlayerMoving();
    let offsets = {
      packetType: 0,
      netID: 4,
      characterState: 12,
      plantingTree: 20,
      x: 24,
      y: 28,
      xSpeed: 32,
      ySpeed: 36,
      punchX: 44,
      punchY: 48
    };

    for (let packetOffset of Object.keys(offsets)) {
      if (packetOffset === 'x' || packetOffset === 'y' || packetOffset === 'xSpeed' || packetOffset === 'ySpeed') {
        dataStruct[packetOffset] = packet.readFloatLE(offsets[packetOffset] + 4, 4);
      } else {
        dataStruct[packetOffset] = packet.readIntLE(offsets[packetOffset] + 4, 4);
      }
    }

    return dataStruct;
  }

  /**
   * Sends the player moving data to everyone in the same world as the peer
   * @param {String} peerid The id of the peer
   * @param {PlayerMoving} data PlayerMoving data
   * @returns {undefined}
   */

  sendPData(peerid, data) {
    let peers = [...this.#main.players.keys()];

    for (let i = 0; i < peers.length; i++) {
      if (this.Host.isInSameWorld(peerid, peers[i])) {
        if (peerid !== peers[i]) {
          data.netID = this.#main.players.get(peerid).netID;
          this.sendPacketRaw(peers[i], 4, this.packPlayerMoving(data), 56, 0);
        }
      }
    }
  };

  /**
   * Makes a peer leaves a world
   * @param {String} peerid The id of the peer
   * @returns {undefined}
   */

  sendPlayerLeave(peerid) {
    let player = this.#main.players.get(peerid);

    if (player) {
      let world = this.#main.worlds.get(player.currentWorld);
      if (world) {
        world.players = world.players.filter(p => p.netID !== player.netID);
        this.#main.worlds.set(world.name, world);
      }

      p.create()
        .string('OnRemove')
        .string(`netID|${player.netID}\n`)
        .end();

      let p2 = new PacketCreator()
        .create()
        .string('OnConsoleMessage')
        .string(`Player: \`w${player.displayName}\`o left.`)
        .end()
        .return();

      let peers = [...this.#main.players.keys()];

      for (let i = 0; i < peers.length; i++) {
        if (this.Host.isInSameWorld(peerid, peers[i])) {
          if (this.Host.checkIfConnected(peers[i])) {
            this.sendPacket(peers[i], p.data, p.len);
            this.sendPacket(peers[i], p2.data, p2.len);
          }
        }
      }

      p.reconstruct();

      player.currentWorld = "EXIT";
      player.temp.MovementCount = 0;
      player.hasClothesUpdated = false;
      this.#main.players.set(peerid, player);
    }
  }

  /**
   * Sends a world to load
   * @param {String} peerid The id of the peer joining
   * @param {Object} world The world to send
   * @returns {undefined}
   */

  sendWorld(peerid, world) {
    let name = world.name.toUpperCase();
    let x = world.width;
    let y = world.height;
    let square = x * y;
    let nameLen = name.length;

    let total = 78 + nameLen + square + 24 + (square * 8);
    let data = Buffer.alloc(total);

    data.writeIntLE(4, 0, 1);
    data.writeIntLE(4, 4, 1);
    data.writeIntLE(8, 16, 1);
    data.writeIntLE(-1, 8, 4);
    data.writeIntLE(nameLen, 66, 1);
    data.write(name, 68, nameLen);
    data.writeIntLE(x, 68 + nameLen, 1);
    data.writeIntLE(y, 72 + nameLen, 1);
    data.writeIntLE(square, 76 + nameLen, 2);

    let mempos = 80 + nameLen;

    for (let i = 0; i < square; i++) {
      data.writeIntLE(world.items[i].foreground, mempos, 2);
      data.writeIntLE(world.items[i].background, mempos + 2, 2);
      data.writeIntLE(0, mempos + 4, 4);

      mempos += 8;
      if (world.items[i].foreground === 6) {
        data.writeIntLE(0x01, mempos, 1)
        data.writeIntLE(0x04, mempos + 1, 1);
        data.writeIntLE(0x00, mempos + 2, 1);
        data.writeIntLE(0x45, mempos + 3, 1);
        data.writeIntLE(0x58, mempos + 4, 1);
        data.writeIntLE(0X49, mempos + 5, 1);
        data.writeIntLE(0x54, mempos + 6, 1);
        data.writeIntLE(0x00, mempos + 7, 1);
        mempos += 8;
      }
    }

    for (let i = 0; i < square; i++) {
      let data = {};
      data.packetType = 0x3;

      data.characterState = 0x0;
      data.x = i%world.width;
      data.y = i/world.height;
      data.punchX = i%world.width;
      data.punchY = i / world.width;
      data.ySpeed = 0;
      data.xSpeed = 0;
      data.netID = -1;
      data.plantingTree = world.items[i].foreground;

      this.sendPacketRaw(peerid, 4, this.packPlayerMoving(data), 56, 0);
    }

    this.#main.worlds.set(name, { data, len: total, ...world });

    this.sendPacket(peerid, data, total);
  }

  /**
   * Sends an onSpawn to a specific peer
   * @param {String} peer The peer to send data to.
   * @param {String} msg The packet to send
   * @return {undefined}
   */

  onSpawn(peer, msg) {
    p.reconstruct();

    p.create()
      .string('OnSpawn')
      .string(msg)
      .end();

    this.sendPacket(peer, p.return().data, p.return().len);
    p.reconstruct();
  }

  /**
   * Sends an onSpawn to every other peer in the same world as the given peer
   * @param {String} peerid Peer that joined
   * @returns {undefined}
   */

  onPeerConnect(peerid) {
    let peers = [...this.#main.players.keys()];

    for (let i = 0; i < this.#main.players.size; i++) {
      if (!this.#main.Host.checkIfConnected(peers[i]))
        continue;

      if (this.Host.isInSameWorld(peerid, peers[i])) {
        if (peerid !== peers[i]) {
          let playerInfo = this.#main.players.get(peers[i]);
          this.onSpawn(peerid, `spawn|avatar\nnetID|${playerInfo.netID}\nuserID|${playerInfo.netID}\ncolrect|0|0|20|30\nposXY|${playerInfo.x}|${playerInfo.y}\nname|\`\`${playerInfo.displayName}\`\`\ncountry|${playerInfo.country}\ninvis|0\nmstate|0\nsmstate|0\n`);

          playerInfo = this.#main.players.get(peerid);
          this.onSpawn(peers[i], `spawn|avatar\nnetID|${playerInfo.netID}\nuserID|${playerInfo.netID}\ncolrect|0|0|20|30\nposXY|${playerInfo.x}|${playerInfo.y}\nname|\`\`${playerInfo.displayName}\`\`\ncountry|${playerInfo.country}\ninvis|0\nmstate|0\nsmstate|0\n`)
        };
      }
    }
  }

  /**
   * Requests the World Select menu for the peer
   * @param {String} peerid The peer to request for.
   * @returns {undefined}
   */

  requestWorldSelect(peerid) {
    let msg = 'default|';

    if (this.#main.worlds.size > 0)
      msg += this.#main.worlds.values().next().value.name;
    else
      msg += 'NODEJS'

    msg += '\nadd_button|Showing: `wWorlds``|_catselect_|0.6|3529161471|';

    for (let [key, value] of this.#main.worlds) {
      msg += `\nadd_button|\`w${key}\`\`|${key}|0.6|3529161471`;
    }

    p.create()
      .string('OnRequestWorldSelectMenu')
      .string(msg)
      .end();

    this.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
  }

  /**
   * Sends the state of the peer by fetching it from players cache.
   * @param {String} peerid The id of the peer
   * @returns {undefined}
   */

  sendState(peerid) {
    let player = this.#main.players.get(peerid);
    let netID = player.netID;
    let peers = [...this.#main.players.keys()];
    let state = player.getState();

    for (let peer of peers) {
      if (!this.#main.Host.checkIfConnected(peer))
        continue;

      let data = new PlayerMoving();
      data.packetType = 0x14;
      data.characterState = 0;
      data.x = player.x;
      data.y = player.y;
      data.punchX = 0;
      data.punchY = 0;
      data.xSpeed = 300;
      data.ySpeed = 600;
      data.netID = netID;
      data.plantingTree = state;

      let packedData = this.packPlayerMoving(data);

      let v = 0x808000;
      packedData.writeUIntLE(v, 1, 3);
      let waterSpeed = 125.0;
      packedData.writeFloatLE(waterSpeed, 16, 4);

      this.sendPacketRaw(peer, 4, packedData, 56, 0);
    }
  }

  sendInventory(peerid) {
    let player = this.#main.players.get(peerid);
    let inventorySize = player.inventory.items.length;
    let packetLen = (Constants.Packets.inventory.length / 2) + (inventorySize * 4) + 4;

    let data = p.create(Constants.Packets.inventory, packetLen)
      .return().data;

    let endianInvVal = _byteswap_ulong(inventorySize);
    data.writeIntLE(endianInvVal, (Constants.Packets.inventory.length / 2) - 4, 4);
    endianInvVal = _byteswap_ulong(player.inventory.size);
    data.writeIntLE(endianInvVal, (Constants.Packets.inventory.length / 2) - 8, 4);

    let val = 0;

    for (let i = 0; i < inventorySize; i++) {
      val = 0;
      val |= player.inventory.items[i].itemID;
      val |= player.inventory.items[i].itemCount << 16;
      val &= 0x00FFFFFF;
      val |= 0x00 << 24;
      data.writeIntLE(val, (i * 4) + (Constants.Packets.inventory.length / 2), 4);
    }

    this.sendPacket(peerid, data, packetLen);
    p.reconstruct();
  }

  sendClothes(peerid) {
    let player = this.#main.players.get(peerid);

    p.create()
      .string('OnSetClothing')
      .float(player.clothes.hair, player.clothes.shirt, player.clothes.pants)
      .float(player.clothes.feet, player.clothes.face, player.clothes.hand)
      .float(player.clothes.back, player.clothes.mask, player.clothes.necklace)
      .intx(player.skinColor)
      .float(0, 0, 0)
      .end();

    let peers = [...this.#main.players.keys()];

    for (let peer of peers) {
      if (!this.#main.Host.checkIfConnected(peer))
        continue;

      if (this.#main.Host.isInSameWorld(peerid, peer)) {
        let packet = p.return().data;
        packet.writeIntLE(player.netID, 8, 4);

        this.sendPacket(peer, packet, p.return().len);
      }
    }

    p.reconstruct();
  }

  updateAllClothes(peerid) {
    let player = this.#main.players.get(peerid);
    let peers = [...this.#main.players.keys()];

    for (let peer of peers) {
      if (!this.#main.Host.checkIfConnected(peer) && (peerid === peer && peers.length > 1))
        continue;

      if (this.#main.Host.isInSameWorld(peerid, peer)) {
        p.create()
          .string('OnSetClothing')
          .float(player.clothes.hair, player.clothes.shirt, player.clothes.pants)
          .float(player.clothes.feet, player.clothes.face, player.clothes.hand)
          .float(player.clothes.back, player.clothes.mask, player.clothes.necklace)
          .intx(player.skinColor)
          .float(0, 0, 0)
          .end();

        let packet = p.return().data;
        let currentPlayer = this.#main.players.get(peer);
        packet.writeIntLE(player.netID, 8, 4);

        this.sendPacket(peer, packet, p.return().len);
        p.reconstruct();

        p.create()
          .string('OnSetClothing')
          .float(currentPlayer.clothes.hair, currentPlayer.clothes.shirt, currentPlayer.clothes.pants)
          .float(currentPlayer.clothes.feet, currentPlayer.clothes.face, currentPlayer.clothes.hand)
          .float(currentPlayer.clothes.back, currentPlayer.clothes.mask, currentPlayer.clothes.necklace)
          .intx(player.skinColor)
          .float(0, 0, 0)
          .end();

        let packet2 = p.return().data;
        packet2.writeIntLE(currentPlayer.netID, 8, 4);

        this.sendPacket(peerid, packet2, p.return().len);
        p.reconstruct();
      }
    }
  }

  sendNothing(peerid, x, y) {
    let data = new PlayerMoving();
    data.packetType = 0x08;
    data.plantingTree = 0;
    data.netID = -1;
    data.x = x;
    data.y = y;
    data.punchX = x;
    data.punchY = y;

    this.sendPacketRaw(peerid, 4, this.packPlayerMoving(data), 56, 0);
  }
};

function _byteswap_ulong(x) {
  x = Buffer.from([x, 0x00, 0x00, 0x00]);

  return x.readIntBE(0, 4);
}

module.exports = Packet;

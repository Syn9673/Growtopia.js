const PlayerInfo = require('../structs/PlayerInfo');
const PlayerMoving = require('../structs/PlayerMoving');
const crypto = require('crypto');

module.exports = function(main, packet, peerid, p) {
  let type = packet.get('dialog_name');

  switch(type) {
    case 'register': {
      let player = main.players.get(peerid);
      if (!player.isGuest) {
        p.create()
          .string('OnConsoleMessage')
          .string('You cannot make an account with a registered id.')
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      if (!packet.has('username') ||
        !packet.has('password') ||
        !packet.has('email') ||
        !packet.get('email').match(/\w+@\w+.\w+/g)) {
        p.create()
          .string('OnConsoleMessage')
          .string('Some of the info given is invalid, please try again.')
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      let username = packet.get('username');
      let password = packet.get('password');
      let email = packet.get('email');

      if (!username.match(/^\w+/g)) {
        p.create()
          .string('OnConsoleMessage')
          .string('Username cannot be empty or contain symbols.')
          .end()

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      if (main.playersDB.has(username.toLowerCase())) {
        p.create()
          .string('OnConsoleMessage')
          .string('An account with this username already exists.')
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      let newPlayer = new PlayerInfo();
      for (let key of Object.keys(player)) {
        newPlayer[key] = player[key];
      }

      newPlayer.tankIDName = username;
      newPlayer.tankIDPass = crypto.createHmac('sha256', main.secret).update(password).digest('hex');
      newPlayer.requestedName = "";
      newPlayer.displayName = username;
      newPlayer.properName = username;
      newPlayer.rawName = username.toLowerCase();
      newPlayer.states = [];
      newPlayer.temp = {};
      newPlayer.isGuest = false;

      main.playersDB.set(newPlayer.rawName, newPlayer);
      p.create()
        .string('OnConsoleMessage')
        .string('`2Successfully registered.')
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      p.reconstruct();

      p.create()
        .string('SetHasGrowID')
        .int(1)
        .string(username)
        .string(password)
        .end();
      
      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      p.reconstruct();

      main.Packet.sendQuit(peerid);

      break;
    }

    case 'edit_sign': {
      let tile = parseInt(packet.get('tile'));
      let newData = packet.get('newData');
      let player = main.players.get(peerid);
      let world = main.worlds.get(player.currentWorld);

      if (world) {
        let signs = world.signs;
        for (let i = 0; i < signs.length; i++) {
          if (signs[i].pos === tile) {
            signs[i].data = newData;
          }
        }

        world.signs = signs;

        main.worlds.set(player.currentWorld, world);

        let data = new PlayerMoving();

        for (let peer of [...main.players.keys()]) {
          if (!main.Host.checkIfConnected(peer))
            continue;

          data.characterState = 0x00;
          data.packetType = 0x03;
          data.netID = -1;
          data.x = parseFloat(packet.get('x'));
          data.y = parseFloat(packet.get('y'));
          data.plantingTree = 20;
          data.xSpeed = 0;
          data.ySpeed = 0;
          data.punchX = parseInt(packet.get('punchX'));
          data.punchY = parseInt(packet.get('punchY'));

          //if (main.Host.isInSameWorld(peerid, peer)) {
            main.Packet.sendPacketRaw(peer, 4, main.Packet.packPlayerMoving(data), 56, 0);
          //}
        }
      }
      break;
    }

    default: {
      console.log(`Unhandled dialog: ${type}`);
      break;
    }
  }
};

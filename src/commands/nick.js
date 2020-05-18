const Constants = require('../structs/Constants');

module.exports = {
  name: 'nick',
  requiredPerms: 2,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let nick = arguments.join(' ');

    if (!nick.match(/^[a-zA-Z0-9]+$/g) && nick.length > 0) {
      p.create()
        .string('OnConsoleMessage')
        .string('Nicknames cannot contain symbols.')
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      return p.reconstruct();
    }

    if (nick.length < 1) {
      nick = player.isGuest ? `${peerid}_${player.properName}` : player.properName;

      let isMod = player.permissions & Constants.Permissions.mod;
      let isAdmin = player.permissions & Constants.Permissions.admin;

      if (isMod > 0 && isAdmin === 0)
        nick = '`#@' + nick;
      else if (isAdmin > 0)
        nick = '`6@' + nick;
    }

    player.displayName = nick;

    nick = `\`\`\`0${nick}`;

    p.create()
      .string('OnConsoleMessage')
      .string(`Changed your nickname to \`w${nick}`)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();

    for (let peer of [...main.players.keys()]) {
      if (!main.Host.checkIfConnected(peer))
        continue;

      if (main.Host.isInSameWorld(peerid, peer)) {
        let p2 = p.create()
          .string('OnNameChanged')
          .string(nick)
          .end()
          .return();

        p2.data.writeIntLE(player.netID, 8, 4);
        main.Packet.sendPacket(peer, p2.data, p2.len);
        p.reconstruct();
      }
    }
  }
};

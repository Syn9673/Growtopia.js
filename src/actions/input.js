module.exports = function(main, packet, peerid, p) {
  let text = packet.get('text');
  let player = main.players.get(peerid);

  if (text.trim().length > 0) {
    let msg = "";

    if (text.startsWith('/')) {
      let arguments = text.slice(1).split(/ +/g);
      let command = arguments.shift().toLowerCase();

      if (main.commands.has(command)) {
        let cmd = main.commands.get(command);
        if ((cmd.requiredPerms & player.permissions) > 0 || (cmd.requiredPerms || 0) === 0)
          return cmd.run(main, arguments, peerid, p);
        else {
          p.create()
            .string('OnConsoleMessage')
            .string(`Command \`4${command}\`o not found.`)
            .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
        }
      } else {
        p.create()
          .string('OnConsoleMessage')
          .string(`Command \`4${command}\`o not found.`)
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      };
    }

    if (player.displayName[2] === '@')
      msg += "`^";

    msg += text;
    msg = msg.trim().split(/ +/g).join(' ');

    p.create()
      .create()
      .string('OnConsoleMessage')
      .string(`CP:0_PL:4_OID:_CT:[W]_ \`6<\`w${player.displayName}\`6> \`o${msg}`)
      .end();

    let p2 = p.new()
      .create()
      .string('OnTalkBubble')
      .intx(player.netID)
      .string(msg)
      .intx(0)
      .end()
      .return();

    let peers = [...main.players.keys()];

    for (let i = 0; i < peers.length; i++) {
      if (main.Host.isInSameWorld(peerid, peers[i])) {
        if (main.Host.checkIfConnected(peers[i])) {
          main.Packet.sendPacket(peers[i], p.return().data, p.return().len);
          main.Packet.sendPacket(peers[i], p2.data, p2.len);
        }
      }
    }

    p.reconstruct();
  }
};

module.exports = {
  name: 'help',
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let commands = [];

    for (let [key, value] of main.commands) {
      const neededPerm = value.requiredPerms;

      if (!neededPerm) {
        commands.push(key);
      } else if (player.permissions > neededPerm) {
        commands.push(key);
      }
    }

    p.create()
      .string('OnConsoleMessage')
      .string(`Available commands: \`w${commands.map(command => `/${command}`).join(' ')}`)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
  }
};

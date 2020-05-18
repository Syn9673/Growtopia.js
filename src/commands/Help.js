module.exports = {
  name: 'help',
  requiredPerms: 0,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let commands = [];

    //console.log(value.requiredPerms & player.permissions)

    for (let [key, value] of main.commands) {
      if (value.requiredPerms > 0)
        if (!(value.requiredPerms & player.permissions)) continue;
      
      commands.push(key);
    }

    p.create()
      .string('OnConsoleMessage')
      .string(`Available commands: \`w${commands.map(command => `/${command}`).join(' ')}`)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
  }
};
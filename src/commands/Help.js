module.exports = {
  name: 'help',
  run: function(main, arguments, peerid, p) {
    let commands = [];
    for (let [key, value] of main.commands) {
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
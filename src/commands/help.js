module.exports = {
  name: 'help',
  run: function(main, arguments, peerid) {
    let commands = [];
    for (let [key, value] of main.commands) {
      commands.push(key);
    };

    let packet = main.packetEnd( 
      main.appendString(
        main.appendString(
          main.createPacket(),
          "OnConsoleMessage"),
          `Available commands: \`w${commands.map(command => `/${command}`).join(' ')}`));

    main.getModule().Packets.sendPacket(peerid, packet.data, packet.len);
  }
};
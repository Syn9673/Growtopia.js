module.exports = {
  name: 'info',
  run: function(main, arguments, peerid) {
    let player = main.players.get(peerid);
    let msg = `Your Info:\n`;
    let keys = Object.keys(player);

    for (let playerData of keys) {
      msg += `\`o${playerData}: \`w${player[playerData]}\`o${keys.indexOf(playerData) === keys.length - 1 ? '' : '\n'}`;
    }

    let packet = main.packetEnd(main.appendString(main.appendString(main.createPacket(), "OnConsoleMessage"), msg));
    main.getModule().Packets.sendPacket(peerid, packet.data, packet.len);
  }
};
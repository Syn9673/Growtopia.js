module.exports = {
  onConnect: function(main, peerid) {
    main.emit('connect', peerid);
    const data = Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00]).toString();

    // send hello packet
    main.getModule().Packets.send(peerid, data);
  },

  onReceive(main, packet, peerid) {
    main.emit('receive', packet, peerid);
    const decodedPacket = main.GetMessage(packet);
    const dataMap = new Map();

    for (let p of decodedPacket.split('\n')) {
      let key = p.split('|')[0].trim();
      let value = p.split('|')[1].trim();

      dataMap.set(key, value);
    }

    if (dataMap.has('action') && dataMap.get('action') === 'quit') {
      main.getModule().Packets.quit(peerid);
    }

    if (dataMap.has('requestedName') || dataMap.has('tankIDName')) {
      let user = dataMap.get('tankIDName') || dataMap.get('requestedName');
      let packet = main.appendString(main.appendString(main.createPacket(), "OnConsoleMessage"), `Hello \`2${user}\`o. The server is currently \`4in development\`o. Please wait for future updates.`)
      main.getModule().Packets.sendPacket(peerid, packet.data, packet.len, packet.indexes);
    }
  }
};
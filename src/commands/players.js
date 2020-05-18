module.exports = {
  name: 'players',
  run: function(main, arguments, peerid, p) {

    let peers = [...main.players.keys()];

    let staff = 0;

    peers.forEach((id) => {
        var playername = main.players.get(id).displayName.replace(/`./g, "");
        if (playername.charAt(0) == "@") {
            staff += 1;
        }
    })

    let string = `\`oThere are \`w${peers.length}\`o player online. \`w${staff}\`o of them are a staff member.`;

    p.create()
      .string('OnConsoleMessage')
      .string(string)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
  }
};

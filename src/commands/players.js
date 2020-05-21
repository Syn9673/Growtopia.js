module.exports = {
  name: 'players',
  run: function(main, arguments, peerid) {

    function send(text) {
        let packet = main.packetEnd(
            main.appendString(
                main.appendString(
                    main.createPacket(), "OnConsoleMessage"
                ),
                text
            )
        );

        main.getModule().Packets.sendPacket(peerid, packet.data, packet.len);
    }

    let peers = [...main.players.keys()];

    let staff = 0;

    peers.forEach((id) => {
        var playername = main.players.get(id).displayName.replace(/`./g, "");
        if (playername.charAt(0) == "@") {
            staff += 1;
        }
    })

    let string = `\`oThere are \`w${peers.length}\`o player online. \`w${staff}\`o of them are a staff member.`;
    send(string)
  }
};

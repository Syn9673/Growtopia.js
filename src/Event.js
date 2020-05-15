const PlayerInfo = require('./structs/PlayerInfo');

module.exports = {
  onConnect: function(main, peerid) {
    main.emit('connect', peerid);
    const data = Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00]).toString();

    // send hello packet
    main.getModule().Packets.send(peerid, data);
  },

  onDisconnect: function(main) {
    let peers = [...main.players.keys()];
    for (let i = 0; i < peers.length; i++) {
      if (!main.getModule().Host.checkIfConnected(peers[i])) {
        main.emit('disconnect', peers[i]);
        main.sendPlayerLeave(peers[i]);
      }
    }
  },

  onReceive(main, packet, peerid) {
    const decodedPacket = main.GetMessage(packet);
    const packetType = main.GetPacketType(packet);
    const dataMap = new Map();

    if (packetType === 4) {
      let struct = main.GetStructPointerFromTankPacket(packet);
      let pMov = main.unpackPlayerMoving(packet);

      switch(struct) {
        case 0: {
          let player = main.players.get(peerid);
          player.x = pMov.x;
          player.y = pMov.y;

          main.players.set(peerid, player);
          main.sendPData(peerid, pMov);
          break;
        }

        case 18: {
          main.sendPData(peerid, pMov);
          break;
        }

        case 7: {
          main.sendPlayerLeave(peerid);

          let text = "default|NODEJS\nadd_button|Showing: `wWorlds``|_catselect_|0.6|3529161471|\n";
          let worlds = [...main.worlds.keys()];

          for (let i = 0; i < worlds.length; i++) {
            text += `add_floater|${main.worlds.get(worlds[i]).name}|0|0.55|3529161471\n`;
          }

          let p = main.packetEnd(
            main.appendString(
              main.appendString(
                main.createPacket(),
                "OnRequestWorldSelectMenu"),
              text));

          main.getModule().Packets.sendPacket(peerid, p.data, p.len);
          break;
        }

        default: {
          console.log(`Unhandled Struct Packet: ${struct}`);
          break;
        }
      }
    } else if (packetType === 2 || packetType === 3) {
      let split = decodedPacket.split('\n');

      for (let i = 0; i < split.length; i++) {
        let vsplit = split[i];
        if (vsplit.startsWith('|')) {
           vsplit = vsplit.slice(1, vsplit.length - 1);
        }

        let value = vsplit.split('|')[1];

        if (value) {
          let index = value.indexOf('\0')
          if (index > -1)
            value = value.substr(0, index);

          dataMap.set(vsplit.split('|')[0], value)
        }
      }

      main.emit('receive', dataMap, peerid);

      if (dataMap.has('action')) {
        switch(dataMap.get('action')) {
          case 'store': {}

          case 'friends': {}

          case 'growid': {
            let p = main.packetEnd(
              main.appendString(
                main.appendString(
                  main.createPacket(),
                  "OnConsoleMessage"),
                "Feature coming `2soon`o."));

            main.getModule().Packets.sendPacket(peerid, p.data, p.len);
            break;
          }

          case 'quit': {
            main.getModule().Packets.quit(peerid);
            break;
          }

          case 'quit_to_exit': {
            main.sendPlayerLeave(peerid);
            break;
          }

          case 'refresh_item_data': {
            main.getModule().Packets.sendPacket(peerid, main.itemsDat, main.itemsDat.length);
            break;
          }

          case 'join_request': {
            let world = main.worlds.get(dataMap.get('name').toUpperCase());

            if (world) {
              let player = main.players.get(peerid);
              player.currentWorld = world.name

              world.players.push(player);
              main.worlds.set(world.name, world);

              main.players.set(peerid, player);

              main.getModule().Packets.sendPacket(peerid, world.data, world.len);
            } else {
              world = main.generateWorld(dataMap.get('name').toUpperCase(), 100, 60);

              let player = main.players.get(peerid);
              player.currentWorld = world.name

              main.players.set(peerid, player);

              world.players.push(player);
              main.worlds.set(world.name, world);

              main.sendWorld(peerid, world);
            };

            let playerInfo = main.players.get(peerid);
            let packet = main.packetEnd(
              main.appendString(
                main.appendString(
                  main.createPacket(),
                  "OnSpawn"),
                `spawn|avatar
netID|${playerInfo.netID}
userID|${playerInfo.netID}
colrect|0|0|20|30
posXY|${main.spawn.x}|${main.spawn.y}
name|\`\`${playerInfo.displayName}\`\`
country|${playerInfo.country}
invis|0
mstate|0
smstate|0
type|local
`));

            main.onPeerConnect(peerid);

            main.getModule().Packets.sendPacket(peerid, packet.data, packet.len);
            break;
          }

          case 'enter_game': {
            let text = "default|NODEJS\nadd_button|Showing: `wWorlds``|_catselect_|0.6|3529161471|\n";
            let worlds = [...main.worlds.keys()];

            for (let i = 0; i < worlds.length; i++) {
              text += `add_floater|${main.worlds.get(worlds[i]).name}|0|0.55|3529161471\n`;
            }

            let p = main.packetEnd(
              main.appendString(
                main.appendString(
                  main.createPacket(),
                  "OnRequestWorldSelectMenu"),
                text));

            main.getModule().Packets.sendPacket(peerid, p.data, p.len);

            p = main.packetEnd(
              main.appendString(
                main.appendString(
                  main.createPacket(),
                  "OnConsoleMessage"),
                "`oWelcome to: `wGrowtopia.js!`o Discord: `whttps://discord.gg/3NrVX8s"));

            main.getModule().Packets.sendPacket(peerid, p.data, p.len);

            let peers = [...main.players.keys()];

            let staff = 0;

            peers.forEach((id) => {
                var playername = main.players.get(id).displayName.replace(/`./g, "");
                if (playername.charAt(0) == "@") {
                    staff += 1;
                }
            })

            let string = `\`oThere are \`w${peers.length}\`o player online. \`w${staff}\`o of them are a staff member.`;

            p = main.packetEnd(
              main.appendString(
                main.appendString(
                  main.createPacket(),
                  "OnConsoleMessage"),
                string));

            main.getModule().Packets.sendPacket(peerid, p.data, p.len);
            break;
          }

          case 'input': {
            let text = dataMap.get('text');
            let player = main.players.get(peerid);

            if (text.trim().length > 0) {
              let msg = "";

              if (text.startsWith('/')) {
                // is command
                let arguments = text.slice(1).split(/ +/g);
                let command = arguments.shift().toLowerCase();

                if (main.commands.has(command)) {
                  let cmd = main.commands.get(command);
                  return cmd.run(main, arguments, peerid);
                } else {
                  let p = main.packetEnd(
                    main.appendString(
                      main.appendString(
                        main.createPacket(),
                        "OnConsoleMessage"),
                      `Command \`4${command}\`o not found.`));
                  return main.getModule().Packets.sendPacket(peerid, p.data, p.len);
                };
              }

              if (player.displayName[2] === '@')
                msg += "`^";

              msg += text;

              let p = main.packetEnd(
                main.appendString(
                  main.appendString(
                    main.createPacket(),
                    "OnConsoleMessage"),
                  `CP:0_PL:4_OID:_CT:[W]_ \`6<\`w${player.displayName}\`6> \`o${msg}`));

              let p2 = main.packetEnd(
                main.appendIntx(
                  main.appendString(
                    main.appendIntx(
                      main.appendString(
                        main.createPacket(),
                        "OnTalkBubble"),
                        player.netID),
                      msg),
                    0));

              let peers = [...main.players.keys()];

              for (let i = 0; i < peers.length; i++) {
                if (main.isInSameWorld(peerid, peers[i])) {
                  main.getModule().Packets.sendPacket(peers[i], p.data, p.len);
                  main.getModule().Packets.sendPacket(peers[i], p2.data, p2.len);
                }
              }
            }
          }
        }
      }

      if (dataMap.has('requestedName') || dataMap.has('tankIDName')) {
        let player = new PlayerInfo();
        let keys = [...dataMap.keys()]

        for (let i = 0; i < keys.length; i++) {
          player[keys[i]] = dataMap.get(keys[i]);
        }

        main.netID++;
        player.netID = main.netID;
        player.displayName = player.tankIDName || `Guest_${player.requestedName}`;

        if (dataMap.has('tankIDName')) {
          // has account
          let p = main.packetEnd(
            main.appendString(
              main.appendString(
                main.appendInt(
                  main.appendString(
                    main.createPacket(),
                    "SetHasGrowID"),
                  1),
                player.tankIDName),
              player.tankIDPass));

          main.getModule().Packets.sendPacket(peerid, p.data, p.len);
        }

        main.players.set(peerid, player);

        var playername = player.displayName;

        if(!playername.match(/^[a-zA-Z0-9]+$/) || playername.length > 12) {
          let p = main.packetEnd(
            main.appendString(
              main.appendString(
                main.createPacket(),
                "OnConsoleMessage"),
              "Malformed username. Length is bigger than 12 or it's not alphanumeric."))

          main.getModule().Packets.sendPacket(peerid, p.data, p.len);

          return main.getModule().Packets.quit(peerid);
        }

        let p = main.packetEnd(
          main.appendString(
            main.appendString(
              main.createPacket(),
              "OnConsoleMessage"),
            "Accounts are not yet handled, any password will work."))

        main.getModule().Packets.sendPacket(peerid, p.data, p.len);

        p = main.packetEnd(
          main.appendString(
            main.appendString(
              main.appendString(
                main.appendString(
                  main.appendInt(
                    main.appendString(
                      main.createPacket(),
                      "OnSuperMainStartAcceptLogonHrdxs47254722215a"),
                    main.itemsDatHash),
                  "ubistatic-a.akamaihd.net"),
                main.cdn),
              "cc.cz.madkite.freedom org.aqua.gg idv.aqua.bulldog com.cih.gamecih2 com.cih.gamecih com.cih.game_cih cn.maocai.gamekiller com.gmd.speedtime org.dax.attack com.x0.strai.frep com.x0.strai.free org.cheatengine.cegui org.sbtools.gamehack com.skgames.traffikrider org.sbtoods.gamehaca com.skype.ralder org.cheatengine.cegui.xx.multi1458919170111 com.prohiro.macro me.autotouch.autotouch com.cygery.repetitouch.free com.cygery.repetitouch.pro com.proziro.zacro com.slash.gamebuster"),
            "proto=84|choosemusic=audio/mp3/about_theme.mp3|active_holiday=0|server_tick=226933875|clash_active=0|drop_lavacheck_faster=1|isPayingUser=0|"))

        main.getModule().Packets.sendPacket(peerid, p.data, p.len);
      }
    }
  }
};

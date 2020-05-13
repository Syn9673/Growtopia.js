const PlayerInfo = require('./structs/PlayerInfo');

module.exports = {
  onConnect: function(main, peerid) {
    main.emit('connect', peerid);
    const data = Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00]).toString();

    // send hello packet
    main.getModule().Packets.send(peerid, data);
  },

  onReceive(main, packet, peerid) {
    const decodedPacket = main.GetMessage(packet);
    const packetType = main.GetPacketType(packet);
    const dataMap = new Map();

    if (packetType === 2 || packetType === 3) {
      let split = decodedPacket.split('\n');

      for (let i = 0; i < split.length; i++) {
        let vsplit = split[i];
        if (vsplit.startsWith('|')) {
           vsplit = vsplit.slice(1, vsplit.length - 1);
        }

        let value = vsplit.split('|')[1];

        if (value) {
          if (value.indexOf('\0') > -1)
            value = value.substring(value.indexOf('\0'), 1);
    
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

          case 'refresh_item_data': {
            main.getModule().Packets.sendPacket(peerid, main.itemsDat, main.itemsDat.length);
            break;
          }

          case 'join_request': {
            let world = main.worlds.get(dataMap.get('name').toUpperCase());

            if (world) {
              main.getModule().Packets.sendPacket(peerid, world.data, world.len);
            } else {
              world = main.generateWorld(dataMap.get('name').toUpperCase(), 100, 60);
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
posXY|3040|736
name|\`\`${playerInfo.displayName}\`\`
country|${playerInfo.country}
invis|0
mstate|0
smstate|0
type|local`));

            main.getModule().Packets.sendPacket(peerid, packet.data, packet.len);
            break;
          }
  
          case 'enter_game': {
            let text = "default|NODEJS\nadd_button|Showing: `wWorlds``|_catselect_|0.6|3529161471|\n";
            let worlds = [...main.worlds.keys()];

            for (let i = 0; i < worlds.length; i++) {
              text += `add_floater|${worlds[i]}|0|0.55|3529161471\n`;
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
                "Server by `2_alexander#9673`o. Discord: https://discord.gg/3NrVX8s"));

            main.getModule().Packets.sendPacket(peerid, p.data, p.len);
            break;
          }

          case 'input': {
            let text = dataMap.get('text');
            let player = main.players.get(peerid);

            if (text.trim().length > 0) {
              let msg = "";
              if (player.displayName[2] === '@')
                msg += "`^";

              msg += text;

              let p = main.packetEnd(
                main.appendString(
                  main.appendString(
                    main.createPacket(),
                    "OnConsoleMessage"),
                  `CP:0_PL:4_OID:_CT:[W]_ \`6<\`w${player.displayName}\`6> \`o${msg}`));

              main.getModule().Packets.sendPacket(peerid, p.data, p.len);

              p = main.packetEnd(
                main.appendIntx(
                  main.appendString(
                    main.appendIntx(
                      main.appendString(
                        main.createPacket(),
                        "OnTalkBubble"),
                        player.netID),
                      msg),
                    0));

              main.getModule().Packets.sendPacket(peerid, p.data, p.len);
            }
          }
        }
      }
  
      if (dataMap.has('requestedName') || dataMap.has('tankIDName')) {
        let player = new PlayerInfo();
        let keys = [...dataMap.keys()];

        for (let i = 0; i < keys.length; i++) {
          player[keys[i]] = dataMap.get(keys[i]);
        }

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
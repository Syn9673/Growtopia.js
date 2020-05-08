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
    const packetType = main.GetPacketType(packet);
    const dataMap = new Map();

    if (packetType === 2 || packetType === 3) {
      for (let p of decodedPacket.split('\n')) {
        if (p.split('|').length > 1) {
          let key = p.split('|')[0].trim();
          let value = p.split('|')[1].trim();
  
          dataMap.set(key, value);
        }
      }
  
      if (dataMap.has('action')) {
        switch(dataMap.get('action')) {  
          case 'quit': {
            main.getModule().Packets.quit(peerid);
            break;
          }

          case 'refresh_item_data': {
            main.getModule().Packets.sendRawPacket(peerid, main.itemsDat);
            break;
          }
  
          case 'enter_game': {
            let p = main.appendString(
              main.appendString(
                main.createPacket(),
                "OnRequestWorldSelectMenu"),
              "default|NODEJS\nadd_button|Showing: `wWorlds``|_catselect_|0.6|3529161471|\nadd_floater|NODEJS|0|0.55|3529161471\n");
  
            main.getModule().Packets.sendPacket(peerid, p.data, p.len, p.indexes);
            delete p;

            p = main.appendString(
              main.appendString(
                main.createPacket(),
                "OnConsoleMessage"),
              "Server by `2_alexander#9673`o. Discord: https://discord.gg/3NrVX8s");

            main.getModule().Packets.sendPacket(peerid, p.data, p.len, p.indexes);
            break;
          }
        }
      }
  
      if (dataMap.has('requestedName') || dataMap.has('tankIDName')) {
        let p = main.appendString(
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
          "proto=84|choosemusic=audio/mp3/about_theme.mp3|active_holiday=0|server_tick=226933875|clash_active=0|drop_lavacheck_faster=1|isPayingUser=0|");
  
        main.getModule().Packets.sendPacket(peerid, p.data, p.len, p.indexes);
      }
    }
  }
};
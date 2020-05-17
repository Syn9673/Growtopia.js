module.exports = function(main, packet, peerid, p) {
  let player = main.players.get(peerid);
  
  if (!player.isGuest) {
    main.playersDB.set(player.rawName, player);
  }

  player.hasClothesUpdated = false;

  main.players.set(peerid, player);
  main.Packet.sendQuit(peerid);
};
module.exports = function(main, packet, peerid, p) {
  main.Packet.sendPlayerLeave(peerid);
  main.Packet.requestWorldSelect(peerid);
}; 
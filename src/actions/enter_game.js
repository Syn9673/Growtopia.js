module.exports = function(main, packet, peerid, p) {
  main.Packet.requestWorldSelect(peerid);
  
  p.create()
    .string('OnConsoleMessage')
    .string('`2Server by _alexander#9673')
    .end();

  main.Packet.sendPacket(peerid, p.return().data, p.return().len);
  p.reconstruct();
};
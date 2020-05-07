/**
 * @class Methods for sending/using/ packets.
 */

class Packet {
  #main;
  constructor(main) {
    this.#main = main;
  }

  /**
   * Sends a raw packet to the server
   * @param {String} peerid The id of the peer
   * @param {Buffer} buffer The buffer to send
   * @returns {undefined}
   */

  sendRawPacket(peerid, buffer) {
    return this.#main.getModule().Packets.send(peerid, buffer.toString());
  }

  /**
   * Sends a "OnConsoleMessage" packet to the client 
   * @param {String} peerid The id of the peer
   * @param {Buffer} packet The packet to send
   * @param {String} message The message to send
   * @returns {undefined}
   */

  log(peerid, message, packet) {
    return this.#main.getModule().Packets.log(peerid, message, packet);
  }

  /**
   * Disconnects the peer.
   * @param {String} peerid The id of the peer
   * @returns {undefined}
   */

  sendQuit(peerid) {
    return this.#main.getModule.Packets.sendQuit(peerid);
  }
};

module.exports = Packet;
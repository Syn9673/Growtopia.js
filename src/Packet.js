/**
 * @class Methods for sending/using/ packets.
 */

class Packet {
  #main;
  constructor(main) {
    this.#main = main;
  }

  /**
   * Sends strings to peer
   * @param {String} peerid The id of the peer
   * @param {String} buffer The string to send
   * @returns {undefined}
   */

  sendStringPacket(peerid, string) {
    return this.#main.getModule().Packets.send(peerid, string);
  }

  /**
   * Sends packet/buffer to peer
   * @param {String} peerid The id of the peer
   * @param {Buffer} buffer The buffer/packet to send 
   * @returns {undefined}
   */

  sendRawPacket(peerid, buffer) {
    return this.#main.getModule().Packets.sendRawPacket(peerid, buffer);
  }

  /**
   * Sends a "OnConsoleMessage" packet to the client 
   * @param {String} peerid The id of the peer
   * @param {String} message The message to send
   * @returns {undefined}
   */

  log(peerid, message) {
    let packet = this.#main.appendString(this.#main.appendString(this.#main.createPacket(), "OnConsoleMessage"), message);

    return this.#main.getModule().Packets.sendPacket(peerid, packet.data, packet.len, packet.indexes);
  }

  /**
   * Disconnects the peer.
   * @param {String} peerid The id of the peer
   * @returns {undefined}
   */

  sendQuit(peerid) {
    return this.#main.getModule().Packets.sendQuit(peerid);
  }

  /**
   * Sends a created packet to the peer
   * @param {String} peerid The id of the peer
   * @param {Object} packet The packet to send
   * @returns {undefined}
   */

  sendPacket(peerid, packet) {
    return this.#main.getModule().Packets.sendPacket(peerid, packet.data, packet.len, packet.indexes);
  }
};

module.exports = Packet;
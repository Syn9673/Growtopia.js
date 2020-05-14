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
   * Sends a "OnConsoleMessage" packet to the client 
   * @param {String} peerid The id of the peer
   * @param {String} message The message to send
   * @returns {undefined}
   */

  log(peerid, message) {
    let packet = this.#main.packetEnd(
      this.#main.appendString(
        this.#main.appendString(
          this.#main.createPacket(),
          "OnConsoleMessage"),
        message));

    return this.sendPacket(peerid, packet.data);
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
   * @param {Number} [length] OPTIONAL: The length to give, by default it will use the packet's length.
   * @returns {undefined}
   */

  sendPacket(peerid, packet, length) {
    return this.#main.getModule().Packets.sendPacket(peerid, packet.data, length || packet.len);
  }

  /**
   * Sends a raw packet to the client
   * @param {String} peerid The id of the peer
   * @param {Number} a1 <Not sure yet>
   * @param {Buffer} data Data to send
   * @param {Number} size Size of the data
   * @param {Number} a4 <Not sure yet>
   * @returns {undefined}
   */

  sendPacketRaw(peerid, a1, data, size, a4) {
    return this.#main.getModule().Packets.sendPacketRaw(peerid, a1, data, size, a4);
  }
};

module.exports = Packet;
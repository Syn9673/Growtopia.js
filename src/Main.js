const { EventEmitter } = require('events');

/**
 * The Main Class is the file that you would require to handle everything.
 * @extends EventEmitter The class responsible for handling events.
 * @prop {Number} port The port to use for the growtopia server.
 * @prop {Number} channels The amount of channels to use.
 * @prop {Number} peers The amount of peers to use.
 * @prop {Object} bandwith Options for the bandwith.
 * @prop {Number} bandwith.incoming The max amount of incoming bandwith.
 * @prop {Number} bandwith.outgoing The max amount of outgoing bandwith.
 */

class Main extends EventEmitter {
  #gtps;
  #os = process.platform;
  #isInitialized;
  #version;

	constructor(options = {}) {
    super(options);
    this.#gtps = require(`../packages/${this.#os}/gtps.node`);
    this.#version = this.#gtps.version;

		Object.defineProperties(this, {
			port: {
				value: options.port || 17091
			},

			channels: {
				value: options.channels || 32
			},

			peers: {
				value: options.peers || 2
			},

			bandwith: {
				value: options.bandwith || { incoming: 0, outgoing: 0 }
      }
		});
	}

	/**
   * Returns the current version of node-gtps you're running.
	 * @readonly
	 */

	get version() {
		return this.#version;
  }

  /**
   * Returns the value of the private variable "isInitialized"
   * @readonly
   */
  
  get isInitialized(){
    return this.#isInitialized;
  }

  /**
   * A modifier to the private variable "isInitialized". This does not initialize enet.
   * @returns {undefined}
   */

  init() {
    this.#isInitialized = true;
  }

  /**
   * Returns the value of the private variable "gtps" which is the compiled c++ addon
   * @returns {Object}
   */

  getModule() {
    return this.#gtps;
  }

  /**
   * Gets the message type from the ArrayBuffer provided by the server.
   * @param {ArrayBuffer} packet The packet you received.
   * @returns {Number} 
   */

  GetPacketType(packet) {
    return Buffer.from(packet).readUInt32LE();
  }

  /**
   * Decodes the packet if it was encoded with raw text.
   * @param {ArrayBuffer} packet The packet you received.
   * @returns {String}
   */
  
  GetMessage(packet) {
    return Buffer.from(packet).toString(undefined, 4)
    .replace('\0', '');
  }

  /**
   * Creates a packet.
   * @returns {Buffer}
   */
  
  createPacket() {
    const asdf = "0400000001000000FFFFFFFF00000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    let buffer = Buffer.alloc(61);
  
    for (let i = 0; i < asdf.length; i +=2) {
      let x = parseInt(asdf[i], 16);
      x = x << 4;
      x += parseInt(asdf[i + 1], 16);
  
      buffer[i / 2] = x;
    }
    
    return buffer;
  }
};

module.exports = Main;
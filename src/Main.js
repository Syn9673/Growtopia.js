const { EventEmitter } = require('events');
const { readFileSync } = require('fs');

/**
 * The Main Class is the file that you would require to handle everything.
 * @extends EventEmitter The class responsible for handling events.
 * @prop {Object} options Options for the server.
 * @prop {Number} options.port The port to use for the growtopia server.
 * @prop {Number} options.channels The amount of channels to use.
 * @prop {Number} options.peers The amount of peers to use.
 * @prop {Object} options.bandwith Options for the bandwith.
 * @prop {Number} options.bandwith.incoming The max amount of incoming bandwith.
 * @prop {Number} options.bandwith.outgoing The max amount of outgoing bandwith.
 * @prop {String} options.location The location of the items.dat file.
 * @prop {String} options.cdn The cdn content to use.
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
      },

      itemsDatHash: {
        value: this.getHash(options.location || 'items.dat')
      },

      itemsDat: {
        value: this.buildItemsDatabase(options.location || 'items.dat')
      },

      cdn: {
        value: options.cdn || "0098/CDNContent59/cache/"
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
   * @param {String} asdf The header of the packet
   * @param {Number} size The size to allocate for the buffer/packet. 
   * @returns {Object}
   */
  
  createPacket(asdf, size) {
    if (!asdf) 
      asdf = "0400000001000000FFFFFFFF00000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    
    if (!size)
      size = 61;
  
    const p = {};
  
    let buffer = Buffer.alloc(size);
  
    for (let i = 0; i < asdf.length; i +=2) {
      let x = parseInt(asdf[i], 16);
      x = x << 4;
      x += parseInt(asdf[i + 1], 16);
  
      buffer[i / 2] = x;
    }
  
    p.data = buffer;
    p.len = size;
    p.indexes = 0;
  
    return p;
  }

  /**
   * Appends a String to the packet
   * @param {Object} packet Packet data
   * @param {String} str The string to append
   * @returns {Object} Packet data
   */

  appendString(packet, str) {
    let p = {}	
  
    let index = Buffer.alloc(1);
    index.writeUIntLE(packet.indexes, 0, 1);
    let strLen = Buffer.alloc(4);
    strLen.writeUInt32LE(str.length);
  
    let buffers = Buffer.concat([
      packet.data,
      index,
      Buffer.from([0x02]),
      strLen,
      Buffer.from(str)
    ]);
  
    packet.indexes++;
  
    p.data = buffers;
    p.len = p.data.length;
    p.indexes = packet.indexes;
    return p;
  }

  /**
   * Appends an Number to the packet
   * @param {Object} packet Packet Data
   * @param {Number} val The value/number to add
   * @returns {Object} Packet data
   */
  
  appendInt(packet, val) {
    let p = {}	
  
    let index = Buffer.alloc(1);
    index.writeUIntLE(packet.indexes, 0, 1);
    let v = Buffer.alloc(4);
    v.writeUInt32LE(val);
  
    let buffers = Buffer.concat([
      packet.data,
      index,
      Buffer.from([0x09]),
      v
    ]);
  
    packet.indexes++;
  
    p.data = buffers;
    p.len = p.data.length;
    p.indexes = packet.indexes;
    return p;
  }

  /**
   * Gets the hash of the items.dat
   * @param {String} location The location of the items.dat file.
   * @returns {Number}
   */

  getHash(location) {
    let h = 0x55555555;
    let file;
    
    try {
      file = readFileSync(location);
    } catch(e) {
      throw new Error("Can't open items.dat, maybe it's not there?");
    }

	  for (let i = 0; i < file.length; i++) {
		  h = (h >>> 27) + (h << 5);
	  }

	  return h;
  }

  /**
   * Builds the item database
   * @param {String} location The location of the items.dat file.
   * @returns {Buffer}
   */

  buildItemsDatabase(location) {
    let file;
    
    try {
      file = readFileSync(location);
    } catch(e) {
      throw new Error("Can't open items.dat, maybe it's not there?");
    }

    let buf = this.createPacket("0400000010000000FFFFFFFF000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000", 60 + file.length);
  
    buf.data.writeUInt32LE(file.length, 56);
    return buf.data;
  }	
};

module.exports = Main;
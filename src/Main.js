const { EventEmitter } = require('events');
const { readFileSync, readdirSync, statSync } = require('fs');
const WorldItem = require('./structs/WorldItem');
const WorldInfo = require('./structs/WorldInfo');
const CONSTANTS = require('./structs/Constants');
const PacketCreator = require('./PacketCreator');
const Endb = require('enmap');
let p = new PacketCreator();
let netID = 0;

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
 * @prop {String} options.secretKey The secret key to use for passwords, PLEASE CHANGE THIS
 */

class Main extends EventEmitter {
  #gtps;
  #os = process.platform;
  #isInitialized;
  #version;
  #loadCommands = function() {
    let files = readdirSync(this.commandsDir)
    .filter(file => statSync(`${this.commandsDir}/${file}`).isFile() && file.endsWith('.js'));

    for (let i = 0; i < files.length; i++) {
      let file = require(`${this.commandsDir}/${files[i]}`);
      this.commands.set(file.name, file);

      console.log(`Loaded ${file.name} command`);
    }
  }
  #loadWorldsToCache = function() {
    for (let [name, world] of this.worldsDB) {
      this.worlds.set(name, world);
    }
  }

  constructor(options = {}) {
    super(options);
    this.#gtps = require(`../packages/${this.#os}/${process.version.slice(1).split('.')[0]}/gtps.node`);
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
        value: options.bandwith || {
          incoming: 0,
          outgoing: 0
        }
      },

      itemsDatHash: {
        value: this.getHash(options.location || 'items.dat')
      },

      itemsDat: {
        value: this.buildItemsDatabase(options.location || 'items.dat')
      },

      cdn: {
        value: options.cdn || "0098/CDNContent61/cache/"
      },

      commandsDir: {
        value: options.commandsDir || `${__dirname}/commands`
      },
      
      secret: {
        value: options.secretKey || 'growtopia.js'
      },

      /**
       * @prop {Map} worlds The worlds cache
       */

      worlds: {
        value: new Map()
      },

      /**
       * @prop {Map} players The players cache
       */

      players: {
        value: new Map()
      },

      /**
       * @prop {Map} commands The commands cache
       */

      commands: {
        value: new Map()
      },

      /**
       * @prop {Enmap} playersDB The players database
       */

      playersDB: {
        value: new Endb({
          name: 'players'
        })
      },

      /**
       * @prop {Enmap} worldsDB The worlds database
       */

      worldsDB: {
        value: new Endb({
          name: 'worlds'
        })
      },

      /**
       * @prop {Packet} Packet The packet handler for the server
       */

      Packet: {
        value: new (require('./Packet'))(this)
      },

      /**
       * @prop {Host} Host The host handler for the server
       */

      Host: {
        value: new (require('./Host'))(this)
      },

      /**
       * @prop {String} actions The location of the actions.
       */

      actions: {
        value: readdirSync(`${__dirname}/actions`)
      },

      /**
       * @prop {Dialog} Dialog The dialog creator for the server
       */

      Dialog: {
        value: new (require('./Dialog'))()
      }
    });

    this.netID = netID;
    this.#loadCommands();
    this.#loadWorldsToCache();
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

  get isInitialized() {
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
    return Buffer.from(packet).toString('utf-8', 4);
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
    } catch (e) {
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
    } catch (e) {
      throw new Error("Can't open items.dat, maybe it's not there?");
    }

    let buf = p.create(CONSTANTS.Packets.itemsDat, 60 + file.length).return();

    buf.data.writeIntLE(file.length, 56, 4);
    for (let i = 0; i < file.length; i++) {
      buf.data[60 + i] = file[i];
    }

    return buf.data;
  }

  /**
   * Generates a world.
   * @param {String} name Name of the world to generate
   * @param {Number} width The width of the world
   * @param {Number} height The height of the world
   * @returns {Object} World data generated
   */

  generateWorld(name, width, height) {
    let world = new WorldInfo();
    world.name = name;
    world.width = width;
    world.height = height;
  
    for (let i = 0; i < world.width*world.height; i++)
    {
      world.items[i] = new WorldItem();
  
      if (i >= 3800 && i < 5400 && !(Math.floor(Math.random() * 50))) { world.items[i].foreground = 10; }
      else if (i >= 3700 && i < 5400) {
        if (i > 5000) {
          if (i % 7 == 0) { world.items[i].foreground = 4;}
          else { world.items[i].foreground = 2; }
        }
        else { world.items[i].foreground = 2; }
      }
      else if (i >= 5400) { world.items[i].foreground = 8; }
      if (i >= 3700)
        world.items[i].background = 14;
      if (i === 3650)
        world.items[i].foreground = 6;
      else if (i >= 3600 && i<3700)
        world.items[i].foreground = 0;
      if (i == 3750)
        world.items[i].foreground = 8;
    }
  
    return world;
  }
};

// DOCS PURPOSES
/**
 * Connect Event
 * 
 * @event Main#connect
 * @property {String} peerid The id of the peer that connected
 */

/**
 * Receive Event
 * Emitted when you receive data
 * 
 * @event Main#receive
 * @property {Map} packet A map of received packets from the client.
 * @property {String} peerid The id of the peer that send that packet.
 */

/**
 * Disconnect Event
 * Emitted when a player leaves the game/disconnect
 * @event Main#disconnect
 * @property {String} peerid The id of the peer that disconnected.
 */

module.exports = Main;
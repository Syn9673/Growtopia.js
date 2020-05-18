const {
  EventEmitter
} = require('events');
const {
  readFileSync,
  readdirSync,
  statSync
} = require('fs');
const WorldItem = require('./structs/WorldItem');
const WorldInfo = require('./structs/WorldInfo');
const CONSTANTS = require('./structs/Constants');
const PacketCreator = require('./PacketCreator');
const Endb = require('enmap');
let p = new PacketCreator();
let netID = 0;
let items = new Map();

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
        value: new(require('./Packet'))(this)
      },

      /**
       * @prop {Host} Host The host handler for the server
       */

      Host: {
        value: new(require('./Host'))(this)
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
        value: new(require('./Dialog'))()
      },

      /**
       * @prop {String} disconnects A map of all players that disconnected, this can be useful for disconnected people. Should be deleted after transfer!
       */

      disconnects: {
        value: new Map()
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

  getItems() {
    return items;
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
    let secret = 'PBG892FXX982ABC*';

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

    //return buf.data;
    let itemCount;
    let mempos = 0;
    let itemsDatVersion = 0;
    let data = file;
    let items = [];

    itemsDatVersion = data.readIntLE(mempos, 2);
    mempos += 2;
    itemCount = data.readIntLE(mempos, 4);
    mempos += 4;

    for (var k = 0; k < itemCount; k++) {
      const id = data.readIntLE(mempos, 4); // First item id
      mempos += 4;
      const editableType = data[mempos]; // Firt item editable type
      mempos += 1;
      const itemCategory = data[mempos]; // Item category (!!)
      mempos += 1;
      const actionType = data[mempos]; // Actiontype
      mempos += 1;
      const hitSoundType = data[mempos]; // Hit sound type
      mempos += 1;
      const nameLength = data.readInt16LE(mempos); // Little-Endian 16 Bit Int
      mempos += 2;

      var name = "";

      for (var i = 0; i < nameLength; i++) {
        name += String.fromCharCode(data[mempos] ^ (secret.charCodeAt((id + i) % secret.length)));
        mempos += 1;
      }

      var texture = "";
      const textureLength = data.readInt16LE(mempos);
      mempos += 2;

      for (var i = 0; i < textureLength; i++) {
        texture += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const textureHash = data.readIntLE(mempos, 4);
      mempos += 4;

      const itemKind = data[mempos];
      mempos += 1;

      const itemVal = data.readIntLE(mempos, 4);
      mempos += 4;

      const textureX = data[mempos];
      mempos += 1;

      const textureY = data[mempos];
      mempos += 1;

      const spreadType = data[mempos];
      mempos += 1;

      const isStripeyWallpaper = data[mempos];
      mempos += 1;

      const collisionType = data[mempos];
      mempos += 1;

      const breakHits = data[mempos];
      mempos += 1;

      const dropChance = data.readIntLE(mempos, 4);
      mempos += 4;

      const clothingType = data[mempos];
      mempos += 1;

      const rarity = data.readIntLE(mempos, 2);
      mempos += 2;

      const maxAmount = data[mempos];
      mempos += 1;

      const extraFileLength = data.readInt16LE(mempos);
      mempos += 2;

      var extraFile = "";
      for (var i = 0; i < extraFileLength; i++) {
        extraFile += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const extraFileHash = data.readIntLE(mempos, 4);
      mempos += 4;

      const audioVolume = data.readIntLE(mempos, 4);
      mempos += 4;

      const petNameLength = data.readInt16LE(mempos);
      mempos += 2;

      var petName = "";
      for (var i = 0; i < petNameLength; i++) {
        petName += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const petPrefixLength = data.readInt16LE(mempos);
      mempos += 2;

      var petPrefix = "";
      for (var i = 0; i < petPrefixLength; i++) {
        petPrefix += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const petSuffixLength = data.readInt16LE(mempos);
      mempos += 2;

      var petSuffix = "";
      for (var i = 0; i < petSuffixLength; i++) {
        petSuffix += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const petAbilityLength = data.readInt16LE(mempos);
      mempos += 2;

      var petAbility = "";
      for (var i = 0; i < petAbilityLength; i++) {
        petAbility += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const seedBase = data[mempos];
      mempos += 1;

      const seedOverlay = data[mempos];
      mempos += 1;

      const treeBase = data[mempos];
      mempos += 1;

      const treeLeaves = data[mempos];
      mempos += 1;


      const seedColor = data.readIntLE(mempos, 4);
      mempos += 4;

      const seedOverlayColor = data.readIntLE(mempos, 4);
      mempos += 4;

      mempos += 4; /* Ingredients Ignored */

      const growTime = data.readIntLE(mempos, 4);
      mempos += 4;

      const itemValueTwo = data.readIntLE(mempos, 2);
      mempos += 2;

      const isRayman = data.readIntLE(mempos, 2);
      mempos += 2;

      const extraOptionsLength = data.readInt16LE(mempos);
      mempos += 2;

      var extraOptions = "";
      for (var i = 0; i < extraOptionsLength; i++) {
        extraOptions += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      var textureTwo = "";
      const textureTwoLength = data.readInt16LE(mempos);
      mempos += 2;

      for (var i = 0; i < textureTwoLength; i++) {
        textureTwo += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const extraOptionsTwoLength = data.readInt16LE(mempos);
      mempos += 2;

      var extraOptionsTwo = "";
      for (var i = 0; i < extraOptionsTwoLength; i++) {
        extraOptionsTwo += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      mempos += 80;;

      var punchOptions = "";

      if (itemsDatVersion >= 11) {
        const punchOptionsLength = data.readInt16LE(mempos);
        mempos += 2;

        for (var y = 0; y < punchOptionsLength; y++) {
          punchOptions += String.fromCharCode(data[mempos]);
          mempos += 1;
        }
      }

      const ItemObject = {
        itemID: id,
        hitSoundType: hitSoundType,
        name: name,
        texture: texture,
        textureHash: textureHash,
        val1: itemVal,
        itemKind: itemKind,
        editableType: editableType,
        itemCategory: itemCategory,
        actionType: actionType,
        textureX: textureX,
        textureY: textureY,
        spreadType: spreadType,
        isStripeyWallpaper: isStripeyWallpaper,
        collisionType: collisionType,
        breakHits: breakHits,
        dropChance: dropChance,
        clothingType: clothingType,
        rarity: rarity,
        maxAmount: maxAmount,
        extraFile: extraFile,
        extraFileHash: extraFileHash,
        audioVolume: audioVolume,
        petName: petName,
        petPrefix: petPrefix,
        petSuffix: petSuffix,
        petAbility: petAbility,
        seedColor: seedColor,
        seedBase: seedBase,
        seedOverlay: seedOverlay,
        treeBase: treeBase,
        treeLeaves: treeLeaves,
        seedOverlayColor: seedOverlayColor,
        growTime: growTime,
        val2: itemValueTwo,
        isRayman: isRayman,
        extraOptions: extraOptions,
        texture2: textureTwo,
        extraOptions2: extraOptionsTwo,
        punchOptions: punchOptions
      };

      items.push(ItemObject);
    }

    for (let item of items) {
      this.getItems().set(item.itemID, item);
    }

    const { writeFileSync } = require('fs');
    //writeFileSync('test.json', JSON.stringify(items, null, 2))

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

    for (let i = 0; i < world.width * world.height; i++) {
      world.items[i] = new WorldItem();

      if (i >= 3800 && i < 5400 && !(Math.floor(Math.random() * 50))) {
        world.items[i].foreground = 10;
      } else if (i >= 3700 && i < 5400) {
        if (i > 5000) {
          if (i % 7 == 0) {
            world.items[i].foreground = 4;
          } else {
            world.items[i].foreground = 2;
          }
        } else {
          world.items[i].foreground = 2;
        }
      } else if (i >= 5400) {
        world.items[i].foreground = 8;
      }
      if (i >= 3700)
        world.items[i].background = 14;
      if (i === 3650)
        world.items[i].foreground = 6;
      else if (i >= 3600 && i < 3700)
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
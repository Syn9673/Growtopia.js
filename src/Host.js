const { EventEmitter } = require('events');
const Event = require('./Event');

/**
 * @extends {EventEmitter} The class the contains all methods that has something to do with the hosts.
 */

class Host extends EventEmitter {
  #main;
  constructor(main) {
    super(main);
    this.#main = main;

    this.on('connect', (peerid) => Event.onConnect(main, peerid));
    this.on('receive', (packet, peerid) => Event.onReceive(main, packet, peerid));
  }

  /**
   * Initializes enet.
   * @returns {Number}
   */

  init() {
    this.#main.init();

    return this.#main.getModule().Host.init();
  }

  /**
   * Creates the server for the growtopia server.
   * @returns {undefined}
   */

  create() {
    if (!this.#main.isInitialized)
      throw new Error("Initialize enet first.");

    return this.#main.getModule().Host.create({
      port: this.#main.port,
      channels: this.#main.channels,
      peers: this.#main.peers,
      ico: this.#main.bandwith.incoming,
      ogo: this.#main.bandwith.outgoing
    });
  }

  /**
   * Starts the growtopia server
   * @returns {undefined}
   */

  start() {
    if (!this.#main.isInitialized)
      throw new Error("Initialize enet first.");

    console.log(`Server now listening on port: ${this.#main.port}`);

    return this.#main.getModule().Host.start(this.emit.bind(this));
  }
};

module.exports = Host;
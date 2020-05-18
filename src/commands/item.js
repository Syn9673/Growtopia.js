const InventoryItem = require('../structs/InventoryItem');

module.exports = {
  name: 'item',
  run: function(main, arguments, peerid, p) {
    let inv = main.players.get(peerid).inventory;
    let item = arguments[0];
    let obj = new InventoryItem();

    obj.itemID = parseInt(item);
    obj.itemCount = 200;

    inv.items.push(obj);
    main.Packet.sendInventory(peerid);
  }
};

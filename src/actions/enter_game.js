const PlayerInventory = require('../structs/PlayerInventory');
const InventoryItem = require('../structs/InventoryItem');

module.exports = function(main, packet, peerid, p) {
  main.Packet.requestWorldSelect(peerid);
  let player = main.players.get(peerid);
  main.players.set(peerid, player);

  p.create()
    .string('OnConsoleMessage')
    .string('`oWelcome to Growtopia.js!')
    .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
    
    let peers = [...main.players.keys()];

    let staff = 0;

    peers.forEach((id) => {
        var playername = main.players.get(id).displayName.replace(/`./g, "");
        if (playername.charAt(0) == "@") {
            staff += 1;
        }
    })

    let string = `\`oThere are \`w${peers.length}\`o player online. \`w${staff}\`o of them are a staff member.`;

    p.create()
      .string('OnConsoleMessage')
      .string(string)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();

    let welcomedialog = main.Dialog
    .defaultColor()
    .addLabelWithIcon("Welcome to Growtopia.js!``","5016","big")
    .addSpacer("small")
    .addTextBox("Our Discord: https://discord.gg/3NrVX8s!")
    .addSpacer("small")
    .addTextBox("Built by Alexander9673 and lukeawarmcat!")
    .endDialog("gazette", "", "OK");

    p.create()
      .string("OnDialogRequest")
      .string(welcomedialog.str())
      .end();


    main.Packet.sendPacket(peerid, p.return().data, p.return().len);

    p.reconstruct();
    welcomedialog.reconstruct();

  let inv = new PlayerInventory();

  for (let i = 0; i < player.inventory.size; i++) {
    let item = new InventoryItem();

    if (i === 1) {
      inv.items.push({ itemID: 32, itemCount: 200 });
    }

    item.itemID = (i * 2) + 2;
    item.itemCount = 200;

    inv.items.push(item);
  }

  player.inventory = inv;
};

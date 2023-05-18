"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Bot_Test_exports = {};
__export(Bot_Test_exports, {
  guilds: () => guilds
});
module.exports = __toCommonJS(Bot_Test_exports);
var import_discord = require("discord.js");
var import_keyv_file = require("keyv-file");
var import_map = __toESM(require("./src/commands/map.js"));
var import_vc = __toESM(require("./src/commands/vc.js"));
var import_team = __toESM(require("./src/commands/team.js"));
const guilds = new import_keyv_file.KeyvFile({
  filename: "guilds.keyv"
});
const client = new import_discord.Client({
  intents: [
    import_discord.GatewayIntentBits.Guilds,
    import_discord.GatewayIntentBits.GuildVoiceStates,
    import_discord.GatewayIntentBits.GuildMembers,
    import_discord.GatewayIntentBits.GuildMessages
  ]
});
const commands = [import_map.default, import_vc.default, import_team.default];
client.once(import_discord.Events.ClientReady, async () => {
  var _a;
  await ((_a = client == null ? void 0 : client.application) == null ? void 0 : _a.commands.set(
    commands.map((command) => {
      return {
        name: command.name,
        description: command.description,
        options: command.options
      };
    }),
    process.env.GUILD_ID
  ));
});
client.on(import_discord.Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand())
    return;
  const command = commands.find((cmd) => cmd.name === interaction.commandName);
  if (!command) {
    console.error(` ${interaction.commandName} \u30B3\u30DE\u30F3\u30C9\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "\u30B3\u30DE\u30F3\u30C9\u3092\u5B9F\u884C\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002", ephemeral: true });
  }
});
client.login(process.env.TOKEN);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  guilds
});
//# sourceMappingURL=index.js.map

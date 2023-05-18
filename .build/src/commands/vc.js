"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var vc_exports = {};
__export(vc_exports, {
  default: () => vc_default
});
module.exports = __toCommonJS(vc_exports);
var import_discord = require("discord.js");
var import_constants = require("../constants");
var import__ = require("../../index");
var vc_default = {
  commandType: "guild",
  name: "vc",
  description: "\u30C1\u30FC\u30E0\u30DC\u30A4\u30B9\u30C1\u30E3\u30C3\u30C8\u3092\u8A2D\u5B9A\u3057\u307E\u3059",
  options: [
    ...Array(import_constants.TEAMS).fill({
      type: import_discord.ApplicationCommandOptionType.Channel,
      required: true
    }).map((t, i) => {
      const index = i + 1;
      return { ...t, name: `vc${index}`, description: `VC${index}` };
    }),
    {
      type: import_discord.ApplicationCommandOptionType.Channel,
      name: "home",
      description: "Home",
      required: false
    }
  ],
  async execute(interaction) {
    var _a, _b, _c;
    if (!interaction.inCachedGuild())
      return;
    const key = interaction.guildId;
    await interaction.deferReply({ ephemeral: true });
    if (!((_c = (_b = (_a = interaction.guild) == null ? void 0 : _a.members.me) == null ? void 0 : _b.roles) == null ? void 0 : _c.botRole)) {
      await interaction.followUp("Bot\u306B\u5FC5\u8981\u306A\u30ED\u30FC\u30EB\u304C\u4ED8\u4E0E\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
      return;
    }
    const options = interaction.options;
    const VCs = Array(import_constants.TEAMS).fill(null).map((_, i) => {
      const index = i + 1;
      const channel = options.getChannel(`vc${index}`);
      return channel;
    });
    const channelHome = options.getChannel("home");
    const notVCs = [...VCs, channelHome].filter((ch) => ch).filter((ch) => (ch == null ? void 0 : ch.type) !== import_discord.ChannelType.GuildVoice);
    if (notVCs.length) {
      await interaction.followUp(`${notVCs.join(", ")} \u306F\u30DC\u30A4\u30B9\u30C1\u30E3\u30F3\u30CD\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093`);
      return;
    }
    const home = channelHome ?? VCs.at(0);
    const channels = {
      home: home == null ? void 0 : home.id,
      VCs: VCs.map((ch) => ch == null ? void 0 : ch.id)
    };
    import__.guilds.set(key, channels);
    await interaction.followUp(
      `\u4EE5\u4E0B\u306E\u5185\u5BB9\u3067\u8A2D\u5B9A\u3057\u307E\u3057\u305F

${VCs.reduce((acc, vc, i) => {
        const index = i + 1;
        return acc + `VC${index} : ${vc}
`;
      }, "")}
Home : ${home}`
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=vc.js.map

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
var team_exports = {};
__export(team_exports, {
  default: () => team_default
});
module.exports = __toCommonJS(team_exports);
var import_discord = require("discord.js");
var import_constants = require("../constants");
var import__ = require("../../index");
var team_default = {
  commandType: "guild",
  name: "team",
  description: "\u30C1\u30FC\u30E0\u5206\u3051\u3092\u884C\u3044\u307E\u3059",
  async execute(interaction) {
    if (!interaction.inCachedGuild())
      return;
    await interaction.deferReply({ ephemeral: false });
    const key = interaction.guildId;
    if (!interaction.inCachedGuild())
      return;
    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.followUp("VC\u306B\u53C2\u52A0\u4E2D\u306E\u307F\u4F7F\u7528\u53EF\u80FD\u3067\u3059");
      return;
    }
    const botMessage = await interaction.followUp(`\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026`);
    const members = channel.members.filter((m) => !m.user.bot);
    const division = import_constants.TEAMS;
    const teamSize = Math.ceil(members.size / division);
    const teamFunc = async (int) => {
      const players = members.clone();
      let under = division * teamSize - players.size;
      const teams = new Array(division).fill(null).map((_, i) => {
        const handicap = Math.ceil(under / (division - i));
        under -= handicap;
        const num = teamSize - handicap;
        const rands = players.random(num);
        players.sweep((p) => rands.includes(p));
        return rands;
      });
      const content = teams.reduce((acc, members2, i) => {
        const index = i + 1;
        return acc + `\u30C1\u30FC\u30E0${index}
` + members2.map((m) => m.toString()).join("\n") + "\n\n";
      }, "");
      const components = [
        new import_discord.ActionRowBuilder().addComponents([
          new import_discord.ButtonBuilder().setCustomId("cancel").setStyle(import_discord.ButtonStyle.Danger).setLabel("\u30AD\u30E3\u30F3\u30BB\u30EB"),
          new import_discord.ButtonBuilder().setCustomId("move").setStyle(import_discord.ButtonStyle.Success).setLabel("\u79FB\u52D5"),
          new import_discord.ButtonBuilder().setCustomId("again").setStyle(import_discord.ButtonStyle.Primary).setLabel("\u518D\u62BD\u9078")
        ])
      ];
      (int == null ? void 0 : int.isButton()) ? await int.update({ content, components }) : await interaction.editReply({ content, components });
      const filter = (i) => i.isButton() && ["cancel", "move", "again"].includes(i.customId) && i.user.id === interaction.user.id;
      const res = await botMessage.awaitMessageComponent({ filter }).catch(async () => {
        var _a, _b;
        (_b = (_a = components[0]) == null ? void 0 : _a.components) == null ? void 0 : _b.forEach((c) => c == null ? void 0 : c.setDisabled());
        await botMessage.edit({ content, components }).catch(() => {
          return;
        });
      });
      if (!res)
        return;
      switch (res.customId) {
        case "cancel": {
          await botMessage.delete().catch(() => {
            return;
          });
          break;
        }
        case "move": {
          await res.update({ content, components: [] });
          const channels = import__.guilds.get(key);
          const VCs = channels.VCs;
          teams.forEach((members2, i) => {
            members2.forEach((member) => {
              if (!member.voice.channel)
                return;
              member.voice.setChannel(VCs[i]);
            });
          });
          break;
        }
        case "again": {
          await teamFunc(res);
          break;
        }
      }
    };
    await teamFunc();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=team.js.map

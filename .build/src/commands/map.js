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
var map_exports = {};
__export(map_exports, {
  default: () => map_default,
  getMap: () => getMap
});
module.exports = __toCommonJS(map_exports);
var import_keyv = __toESM(require("keyv"));
var map_default = {
  commandType: "global",
  name: "map",
  description: "\u30E9\u30F3\u30C0\u30E0\u306B\u30DE\u30C3\u30D7\u3092\u9078\u629E\u3057\u307E\u3059",
  async execute(interaction) {
    const map = await getMap();
    const content = map ?? "\u30DE\u30C3\u30D7\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F";
    await interaction.reply(content);
  }
};
const mapsCache = new import_keyv.default({
  namespace: "maps"
});
const getMap = async () => {
  const cached = await mapsCache.get("maps");
  if (!cached) {
    const mapApi = `https://valorant-api.com/v1/maps?language=ja-JP`;
    const res = await fetch(mapApi);
    const data = await res.json();
    const mapsData = data.data.map((map2) => map2.displayName);
    mapsCache.set("maps", mapsData, 60 * 60 * 1e3);
  }
  const maps = cached ?? await mapsCache.get("maps") ?? [
    "\u30A2\u30BB\u30F3\u30C8",
    "\u30D0\u30A4\u30F3\u30C9",
    "\u30B9\u30D7\u30EA\u30C3\u30C8",
    "\u30D8\u30A4\u30D6\u30F3",
    "\u30A2\u30A4\u30B9\u30DC\u30C3\u30AF\u30B9",
    "\u30D6\u30EA\u30FC\u30BA",
    "\u30ED\u30FC\u30BF\u30B9",
    "\u30D5\u30E9\u30AF\u30C1\u30E3\u30FC"
  ];
  const map = maps[Math.floor(Math.random() * maps.length)];
  return map;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMap
});
//# sourceMappingURL=map.js.map

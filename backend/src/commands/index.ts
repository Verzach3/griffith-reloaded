import { help } from "./help";
import { instadl } from "./instadl";
import { multidl } from "./multidl";
import ping from "./ping";
import { random } from "./random";
import { report } from "./report";
import { stick } from "./stick";
import { ttkdl } from "./ttkdl";
import { ytdlh } from "./ytdl";

export const commands = [
  {
    name: "help",
    aliases: ["commands", "cmds", "command", "cmd", "ayuda", "comandos"],
    handler: help,
    description: "Muestra la esta lista de comandos",
    usage: "help"
  },
  {
    name: "ping",
    handler: ping,
    description: "Responde pong",
    usage: "ping",
    aliases: ["pong"],
    category: "general",
  },
  {
    name: "stick",
    handler: stick,
    description: "Genera un sticker con la imagen/video que se envie/mencione",
    usage: "stick",
    aliases: ["sticker", "st", "stk"],
    category: "general",
  },
  {
    name: "ytdl",
    handler: ytdlh,
    description: "Descarga un video de youtube con el link",
    usage: "ytdl <link>",
    aliases: ["youtube", "yt"],
    category: "general",
  },
  {
    name: "random",
    handler: random,
    description: "Genera un numero aleatorio entre un rango, si no se especifica un rango, se genera un numero entre 0 y 10",
    usage: "random <min> <max>",
    aliases: ["rand", "rnd"],
    category: "general",
  },
  {
    name: "ttkdl",
    handler: ttkdl,
    description: "Descarga un video de tiktok con el link",
    usage: "ttkdl <link>",
    aliases: ["tiktok", "tt"],
    category: "general",
  },
  {
    name: "instadl",
    handler: instadl,
    description: "Descarga un video de instagram con el link",
    usage: "instadl <link>",
    aliases: ["instagram", "insta", "instadl"],
    category: "general",
  },
  {
    name: "multidl",
    handler: multidl,
    description: "Descarga videos de varios sitios web, como twitter, tumblr, pinterest, etc",
    usage: "multidl <link>",
    aliases: ["multi", "multi-dl", "multi-download", "multidownload", "dl"],
  },
  {
    name: "report",
    handler: report,
    description: "Reporta un error a un administrador",
    usage: "report <error>",
    aliases: ["error", "err", "er"],
    category: "general",
  }
];



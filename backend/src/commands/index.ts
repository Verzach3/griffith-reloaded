import { help } from "./help";
import ping from "./ping";
import { random } from "./random";
import { stick } from "./stick";
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
  }
];


import ping from "./ping"
import { stick } from "./stick"

export const commands = [
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
  }
]
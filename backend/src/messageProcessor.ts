import { commands } from "./commands";
import { receivedMessage  } from "./interfaces/receivedMessage";

export async function messageProcessor(message: receivedMessage ) {
  commands.forEach(async command => {
    if (command.name === message.command) {
      command.handler(message);
    }
  });
  commands.forEach(async command => {
    if (command.aliases.includes(message.command)) {
      command.handler(message);
    }
  });
}
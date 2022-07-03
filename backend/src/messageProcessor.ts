import { commands } from "./commands";
import { receivedMessage  } from "./interfaces/receivedMessage";

export async function messageProcessor(message: receivedMessage ) {
  commands.forEach(command => {
    if (command.name === message.command) {
      command.handler(message);
    }
  });
  commands.forEach(command => {
    if (command.aliases.includes(message.command)) {
      command.handler(message);
    }
  });
}
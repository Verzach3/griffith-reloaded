import { commands } from "./commands";
import { receivedMessage  } from "./interfaces/receivedMessage";

export function messageProcessor(message: receivedMessage ) {
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
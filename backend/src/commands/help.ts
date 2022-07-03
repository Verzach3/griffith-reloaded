import { receivedMessage } from "../interfaces/receivedMessage";
import reply from "../util/reply";
import { commands } from "./index";

export function help(message: receivedMessage) {
  const answer: string[] = [];
  answer.push(`
╭──┈ ➤ ✎ 【﻿ＭＥＮＵ】
`);
  commands.forEach((command) => {
    answer.push(
      ` ➤ **${command.name}**: ${command.description}\n *Uso*: ${command.usage}`
    );
  });
  answer.push(`
│ Mas en camino!
╰─────────────❁ཻུ۪۪⸙͎`);
  reply(message, answer.join("\n\n"));
}

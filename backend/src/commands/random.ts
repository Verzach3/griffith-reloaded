import { receivedMessage } from "../interfaces/receivedMessage";
import reply from "../util/reply";

export function random(message: receivedMessage) {
  const args = message.args
  if (args.length === 2) {
    const min = parseInt(args[0]);
    const max = parseInt(args[1]);
    if (!isNaN(min) && !isNaN(max)) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      reply(message, randomNumber.toString());
    } else {
      reply(message, "Error: los argumentos deben ser numeros");
    }
  }else if(args.length === 0){
    const randomNumber = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
    reply(message, randomNumber.toString());
  } else {
    reply(message, "Error: Argumentos invalidos");
  }
}
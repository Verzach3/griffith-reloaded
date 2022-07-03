import { receivedMessage } from "../interfaces/receivedMessage";
import reply from "../util/reply";

export default function ping(message: receivedMessage) {
  reply(message, "pong");
}
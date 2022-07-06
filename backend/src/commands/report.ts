import { receivedMessage } from "../interfaces/receivedMessage";
import reply from "../util/reply";

export async function report(message: receivedMessage) {
  const sender = message.from
  reply(message, "Reporte enviado")
  message.from = "573135408570@s.whatsapp.net"
  reply(message, `Reporte de ${sender}:\n${message.args.join(" ")}`)
}
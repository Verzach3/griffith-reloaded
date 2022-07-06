import { receivedMessage } from "../interfaces/receivedMessage";
import { sendedMessage } from "../interfaces/sendedMessage";

export default async function reply(message: receivedMessage, reply: string, type?: "text" | "image" | "video" | "audio" | "sticker", mediaPath?: string) {
  if (type === undefined) {
    type = "text";
  }
  if (mediaPath === undefined) {
    mediaPath = "";
  }
  const replyMessage: sendedMessage = {
    to: message.from,
    message: reply,
    type: type,
    hasMedia: false,
    mediaPath: mediaPath
  };
  await globalSendQueue.createJob(replyMessage).save();
}